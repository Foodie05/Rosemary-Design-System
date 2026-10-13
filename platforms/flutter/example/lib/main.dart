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

RosemaryColors paletteFromJson(Map<String, dynamic> json) {
  Color color(String name) =>
      Color(int.parse('FF${(json[name] as String).substring(1)}', radix: 16));
  return RosemaryColors(
    canvas: color('canvas'),
    surface: color('surface'),
    raised: color('raised'),
    ink: color('ink'),
    muted: color('muted'),
    border: color('border'),
    control: color('control'),
    primary: color('primary'),
    onPrimary: color('on-primary'),
    primarySoft: color('primary-soft'),
    sun: color('sun'),
    onSun: color('on-sun'),
    sky: color('sky'),
    onSky: color('on-sky'),
    success: color('success'),
    successSoft: color('success-soft'),
    warning: color('warning'),
    warningSoft: color('warning-soft'),
    danger: color('danger'),
    dangerSoft: color('danger-soft'),
    onDanger: color('on-danger'),
    info: color('info'),
    infoSoft: color('info-soft'),
    focus: color('focus'),
  );
}

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
