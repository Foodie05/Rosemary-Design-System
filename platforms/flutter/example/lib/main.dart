import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rosemary_ui/rosemary_ui.dart';
import 'gallery.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final json =
      jsonDecode(
            await rootBundle.loadString('../../../design/themes/vigilo.json'),
          )
          as Map<String, dynamic>;
  runApp(GalleryApp(vigilo: json['themes'] as Map<String, dynamic>));
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
  const GalleryApp({super.key, this.vigilo});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    home: RosemaryGallery(vigilo: vigilo),
  );
}
