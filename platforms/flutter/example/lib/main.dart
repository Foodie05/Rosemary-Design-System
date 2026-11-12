import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rosemary_ui/rosemary_ui.dart';
import 'gallery.dart';

Future<Map<String, dynamic>> loadVigiloTheme() async {
  final json =
      jsonDecode(await rootBundle.loadString('assets/vigilo.json'))
          as Map<String, dynamic>;
  return json['themes'] as Map<String, dynamic>;
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(GalleryApp(vigilo: await loadVigiloTheme()));
}

RosemaryColors paletteFromJson(Map<String, dynamic> json) =>
    RosemaryColors.fromHex(json);

class GalleryApp extends StatelessWidget {
  final Map<String, dynamic>? vigilo;
  final String initialComponent;
  const GalleryApp({super.key, this.vigilo, this.initialComponent = 'button'});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    home: RosemaryGallery(vigilo: vigilo, initialComponent: initialComponent),
  );
}
