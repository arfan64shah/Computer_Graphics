#include "bmp.h"
#include <math.h>
#define width 400
#define height 400
#define image_size 3*width*height

unsigned char image[image_size];

void set_pixel(int x, int y, double r, double g, double b) {
	int index;
	if (x >= 0 && x < width && y >= 0 && y < height) {
		index = 3*(x + width*y);
		image[index  ] = (unsigned char) r;
		image[index+1] = (unsigned char) g;
		image[index+2] = (unsigned char) b;
		}
	}

void draw_line_x1(double x1, double y1, double x2, double y2) {
   int x, iy;
   double m, y;
   m = (y2 - y1) / (x2 - x1);
   y = y1 + m*(floor(x1) + .5 - x1);
   for (x = floor(x1); x < floor(x2); ++x) {
      iy = floor(y);
      set_pixel(x, iy, 255, 255, 255);
      y += m;
      }
   }

void draw_line_x2(double x1, double y1, double x2, double y2) {
   int x, iy;
   double m, y;
   m = (y2 - y1) / (x2 - x1);
   y = y1 + m*(floor(x1) + .5 - x1);
   for (x = floor(x1); x > floor(x2); --x) {
      iy = floor(y);
      set_pixel(x, iy, 255, 255, 255);
      y -= m;
      }
   }

void draw_line_y1(double x1, double y1, double x2, double y2) {
   int y, ix;
   double m, x;
   m = (x2 - x1) / (y2 - y1);
   x = x1 + m*(floor(y1) + .5 - y1);
   for (y = floor(y1); y < floor(y2); ++y) {
      ix = floor(x);
      set_pixel(ix, y, 255, 255, 255);
      x += m;
      }
   }

void draw_line_y2(double x1, double y1, double x2, double y2) { 
   int y, ix;
   double m, x;
   m = (x2 - x1) / (y2 - y1);
   x = x1 + m*(floor(y1) + .5 - y1);
   for (y = floor(y1); y > floor(y2); --y) {
      ix = floor(x);
      set_pixel(ix, y, 255, 255, 255);
      x -= m;
      }
   }
   
double function(double x, double m, double b) {
    return m*x + b;
}

 void draw_line(double x1, double y1, double x2, double y2) {
   if (fabs(x2 - x1) > fabs(y2 - y1) ) {
      if (x2 > x1)
      draw_line_x1(x1, y1, x2, y2); 
      else
      draw_line_x2(x1, y1, x2, y2);
   }
   else{
      if (y2 > y1)
      draw_line_y1(x1, y1, x2, y2);
      else
      draw_line_y2(x1, y1, x2, y2);
   }
   }

 int main(int argc, char** argv) {  
   int j, n = 40;
   double x1, y1, x2, y2, ctheta, stheta;

	for (j = 0; j < image_size; ++j)
		image[j] = 0;

   double radius = 180.;

   for (j = 0; j <= n; ++j) {

      x2 = 199.5 + radius*cos(2*M_PI*j/n);
      y2 = 199.5 + radius*sin(2*M_PI*j/n);
      if (j > 0)
         draw_line(x1, y1, x2, y2);
      x1 = x2;
      y1 = y2;
      }
	write_bmp((char*) "Line_x.bmp", (char*) image, image_size, width);
	return 1;
}
