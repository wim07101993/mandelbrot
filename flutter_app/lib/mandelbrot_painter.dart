import 'dart:ui';

import 'package:flutter/material.dart';

class MandelbrotPainter extends CustomPainter {
  const MandelbrotPainter({
    required this.shader,
    this.zoom = 1,
    this.coordinate = Offset.zero,
  });

  final FragmentShader shader;
  final double zoom;
  final Offset coordinate;

  @override
  void paint(Canvas canvas, Size size) {
    shader.setFloat(0, size.width);
    shader.setFloat(1, size.height);
    shader.setFloat(2, coordinate.dx);
    shader.setFloat(3, coordinate.dy);
    shader.setFloat(4, zoom);

    final paint = Paint()..shader = shader;
    canvas.drawRect(Offset.zero & size, paint);
  }

  @override
  bool shouldRepaint(MandelbrotPainter oldPainter) {
    return oldPainter.shader != shader ||
        oldPainter.coordinate != coordinate ||
        oldPainter.zoom != zoom;
  }
}
