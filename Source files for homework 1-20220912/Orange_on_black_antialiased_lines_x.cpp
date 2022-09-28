#include "bmp.h"
#include <math.h>
#define width 400
#define height 400
#define image_size 3*width*height

unsigned char image[image_size];
float line_color[3] = {1., .5, 0.}; // orange
int gamma_correction = 0;

void set_pixel(int x, int y, double r, double g, double b) {
   int index;
   if (x >= 0 && x < width && y >= 0 && y < height) {
      index = 3*(x + width*y);
      if (gamma_correction) {
         image[index  ] = (unsigned char) 255.*sqrt(r);
         image[index+1] = (unsigned char) 255.*sqrt(g);
         image[index+2] = (unsigned char) 255.*sqrt(b);
         }
      else {
         image[index  ] = (unsigned char) 255.*r;
         image[index+1] = (unsigned char) 255.*g;
         image[index+2] = (unsigned char) 255.*b;
         }
      }
   }

void draw_line_x(double x1, double y1, double x2, double y2) {  // only works if x2 > x1
   int xstep, xstart, xstop, x, iy;
   double ofac, ffac, slope, increment, y, r, g, b;
   slope = (y2 - y1) / (x2 - x1);
   if (x2 < x1) {
      xstep = -1;
      increment = -slope;
      }
   else {
      xstep = 1;
      increment = slope;
      }
   xstart = floor(x1);
   xstop = floor(x2);
   y = y1 + (xstart + .5 - x1) * slope;
   for (x = xstart; x < xstop; ++x) { // this works only when x2 > x1
      iy = floor(y);
		if (y > iy + .5) {
			ofac = y - (iy + .5);
			ffac = 1. - ofac;
			r = ffac*line_color[0];
			g = ffac*line_color[1];
			b = ffac*line_color[2];
      	set_pixel(x, iy, r, g, b);
			r = ofac*line_color[0];
			g = ofac*line_color[1];
			b = ofac*line_color[2];
      	set_pixel(x, iy+1, r, g, b);
			}
		else {
			ofac = iy + .5 - y;
			ffac = 1. - ofac;
			r = ffac*line_color[0];
			g = ffac*line_color[1];
			b = ffac*line_color[2];
      	set_pixel(x, iy, r, g, b);
			r = ofac*line_color[0];
			g = ofac*line_color[1];
			b = ofac*line_color[2];
      	set_pixel(x, iy-1, r, g, b);
			}
      y += increment;
      }
   }

void draw_line_y(double x1, double y1, double x2, double y2) {
	return;  // you need to write this version
   }

void draw_line(double x1, double y1, double x2, double y2) {
	char *filename;
   if (fabs(x2 - x1) > fabs(y2 - y1) )
      draw_line_x(x1, y1, x2, y2); 
   else
      draw_line_y(x1, y1, x2, y2);
   }

int main(int argc, char** argv) {  
   int i, index, n = 10;
   double x1, y1, x2, y2, theta, cenx, ceny, ctheta, stheta;
	char* filename = (char*) "Orange_on_black_antialiased_lines_no_gamma.bmp";

	if (argc > 1)
		n = atoi(argv[1]);
   if (argc > 2)
      gamma_correction = atoi(argv[2]);
	if (argc > 3)
		filename = argv[2];
	
	// set image to background color
	for (i = 0; i < image_size; ++i)
		image[i] = 0;

	double radius = 180.;
	cenx = 199.5;
	ceny = 199.5;
  	for (i = 0; i <= n; ++i) {
     	// theta = 2*M_PI*i/n; // for drawing a full circle; this version can only draw 1/4 of the cases
     	theta = (1.25 + .5*i/n)*M_PI;
		x2 = cenx + radius*cos(theta);
		y2 = ceny + radius*sin(theta);
		if (i > 0)
     		draw_line(x1, y1, x2, y2);
		x1 = x2;
		y1 = y2;
		}
	write_bmp(filename, (char*) image, image_size, width);
	return 1;
	}
