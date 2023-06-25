import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:mandelbrot/mandelbrot_painter.dart';

class Mandelbrot extends StatefulWidget {
  const Mandelbrot({super.key});

  @override
  State<Mandelbrot> createState() => _MandelbrotState();
}

class _MandelbrotState extends State<Mandelbrot> {
  final shaderFuture = FragmentProgram.fromAsset('shaders/mandelbrot.frag')
      .then((program) => program.fragmentShader());

  double zoom = 1.0;
  Offset position = Offset.zero;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<FragmentShader>(
      future: shaderFuture,
      builder: (context, snapshot) {
        final shader = snapshot.data;
        return shader == null
            ? const Center(child: CircularProgressIndicator())
            : _mandelbrotPaint(shader);
      },
    );
  }

  Widget _mandelbrotPaint(FragmentShader shader) {
    return GestureDetector(
      onVerticalDragUpdate: (update) {
        if (zoom <= 0.5 && update.delta.dy > 0) {
          return;
        }
        setState(() {
          position = update.localPosition;
          zoom -= update.delta.dy / 100;
        });
      },
      child: CustomPaint(
        painter: MandelbrotPainter(
          shader: shader,
          zoom: 1 / zoom,
        ),
      ),
    );
  }
}
