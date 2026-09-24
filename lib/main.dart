import 'package:flutter/material.dart';
import 'package:mongo_dart/mongo_dart.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';

const String MONGO_URL =
    "mongodb+srv://mhmdhsnjlyly40_db_user:JCiJRmXMBIceSojTQ@cluster0.cticac2.mongodb.net/?appName=Cluster0";

class DB {
  static Db? _db;
  static DbCollection? users;
  static DbCollection? posts;

  static Future<bool> connect() async {
    try {
      _db = await Db.create(MONGO_URL);
      await _db!.open();
      users = _db!.collection('users');
      posts = _db!.collection('posts');
      print('Connected to MongoDB');
      return true;
    } catch (e) {
      print('DB Error: $e');
      return false;
    }
  }

  static bool get isConnected => _db?.isOpen ?? false;
}

class Post {
  final String id;
  final String authorName;
  final String text;
  final DateTime createdAt;
  final int likes;

  Post({
    required this.id,
    required this.authorName,
    required this.text,
    required this.createdAt,
    required this.likes,
  });

  factory Post.fromMap(Map<String, dynamic> m) => Post(
        id: m['_id'].toString(),
        authorName: m['authorName'] ?? 'ناشناس',
        text: m['text'] ?? '',
        createdAt: DateTime.tryParse(m['createdAt'] ?? '') ?? DateTime.now(),
        likes: (m['likes'] is int) ? m['likes'] : 0,
      );
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await DB.connect();
  runApp(const ManoAsghariApp());
}

class ManoAsghariApp extends StatelessWidget {
  const ManoAsghariApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'منو اصغری',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.teal, useMaterial3: true),
      home: const LoginScreen(),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _nameController = TextEditingController();
  bool _loading = false;

  Future<void> _enter() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('اسمت رو بنویس')),
      );
      return;
    }

    setState(() => _loading = true);

    if (!DB.isConnected) {
      final ok = await DB.connect();
      if (!ok) {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('اتصال به دیتابیس نشد')),
        );
        return;
      }
    }

    try {
      final existing = await DB.users!.findOne(where.eq('name', name));
      if (existing == null) {
        await DB.users!.insertOne({
          '_id': ObjectId().oid,
          'name': name,
          'username': name,
          'bio': '',
          'createdAt': DateTime.now().toIso8601String(),
        });
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('myName', name);

      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const FeedScreen()),
      );
    } catch (e) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('خطا: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('منو اصغری',
                  style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('اسمت رو بنویس و بیا تو',
                  style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 32),
              TextField(
                controller: _nameController,
                textAlign: TextAlign.center,
                decoration: const InputDecoration(
                  labelText: 'اسمت',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _loading ? null : _enter,
                  child: _loading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('ورود', style: TextStyle(fontSize: 18)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  List<Post> _posts = [];
  bool _loading = true;
  String _myName = '';
  final _postController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    _myName = prefs.getString('myName') ?? 'ناشناس';
    await _loadPosts();
  }

  Future<void> _loadPosts() async {
    setState(() => _loading = true);
    try {
      final data = await DB.posts!
          .find(where.sortBy('createdAt', descending: true).limit(50))
          .toList();
      setState(() {
        _posts = data.map((e) => Post.fromMap(e)).toList();
        _loading = false;
      });
    } catch (e) {
      print('Load error: $e');
      setState(() => _loading = false);
    }
  }

  Future<void> _addPost() async {
    final text = _postController.text.trim();
    if (text.isEmpty) return;
    try {
      await DB.posts!.insertOne({
        'authorId': _myName,
        'authorName': _myName,
        'text': text,
        'createdAt': DateTime.now().toIso8601String(),
        'likes': 0,
      });
      _postController.clear();
      FocusScope.of(context).unfocus();
      await _loadPosts();
    } catch (e) {
      print('Insert error: $e');
    }
  }

  Future<void> _likePost(Post post) async {
    try {
      await DB.posts!.updateOne(
        where.eq('_id', ObjectId.fromHexString(post.id)),
        modify.inc('likes', 1),
      );
      await _loadPosts();
    } catch (e) {
      print('Like error: $e');
    }
  }

  Future<void> _deletePost(Post post) async {
    try {
      await DB.posts!.deleteOne(
        where.eq('_id', ObjectId.fromHexString(post.id)),
      );
      await _loadPosts();
    } catch (e) {
      print('Delete error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('منو اصغری'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ProfileScreen(name: _myName),
                ),
              );
            },
          ),
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadPosts),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _postController,
                    decoration: const InputDecoration(
                      hintText: 'چی تو ذهنته؟',
                      border: OutlineInputBorder(),
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(onPressed: _addPost, child: const Text('بفرست')),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _posts.isEmpty
                    ? const Center(child: Text('هنوز کسی چیزی ننوشته'))
                    : RefreshIndicator(
                        onRefresh: _loadPosts,
                        child: ListView.builder(
                          itemCount: _posts.length,
                          itemBuilder: (context, i) {
                            final p = _posts[i];
                            final isMine = p.authorName == _myName;
                            return Card(
                              margin: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              child: Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          child: Text(p.authorName.isNotEmpty
                                              ? p.authorName[0]
                                              : '?'),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(p.authorName,
                                                  style: const TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold)),
                                              Text(
                                                DateFormat('yyyy/MM/dd - HH:mm')
                                                    .format(
                                                        p.createdAt.toLocal()),
                                                style: const TextStyle(
                                                    fontSize: 11,
                                                    color: Colors.grey),
                                              ),
                                            ],
                                          ),
                                        ),
                                        if (isMine)
                                          IconButton(
                                            icon: const Icon(Icons.delete,
                                                color: Colors.grey, size: 20),
                                            onPressed: () => _deletePost(p),
                                          ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(p.text,
                                        style: const TextStyle(fontSize: 16)),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.favorite_border,
                                              color: Colors.red),
                                          onPressed: () => _likePost(p),
                                        ),
                                        Text('${p.likes}'),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

class ProfileScreen extends StatefulWidget {
  final String name;
  const ProfileScreen({super.key, required this.name});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _user;
  int _myPostCount = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final u = await DB.users!.findOne(where.eq('name', widget.name));
      final count = await DB.posts!.count(where.eq('authorName', widget.name));
      setState(() {
        _user = u;
        _myPostCount = count;
        _loading = false;
      });
    } catch (e) {
      print('Profile load error: $e');
      setState(() => _loading = false);
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('myName');
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('پروفایل'),
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const CircleAvatar(radius: 50, child: Icon(Icons.person, size: 50)),
                  const SizedBox(height: 16),
                  Text(widget.name,
                      style: const TextStyle(
                          fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  Card(
                    child: ListTile(
                      leading: const Icon(Icons.article),
                      title: const Text('تعداد پست‌ها'),
                      trailing: Text('$_myPostCount'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}