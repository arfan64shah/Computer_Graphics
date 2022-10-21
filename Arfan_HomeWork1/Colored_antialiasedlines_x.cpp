#include "bmp.h"
#include <math.h>
#define width 400
#define height 400
#define image_size 3*width*height

float line_color[3] = {1., .5, 0.};
float background_color[3] = {.0, .2, .7};
int gamma_correction = 0;
unsigned char image[image_size];



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

void draw_line_x1(double x1, double y1, double x2, double y2) {
   int xstep, x, iy;
   double ofac, ffac, m, increment, y, r, g, b;
   m = (y2 - y1) / (x2 - x1);
   y = y1 + (floor(x1) + .5 - x1) * m;
   for (x = floor(x1); x < floor(x2); ++x) {
      iy = floor(y);
		if (y > iy + .5) {
			ofac = y - (iy + .5);
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(x, iy, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(x, iy+1, r, g, b);
			}
		else {
			ofac = iy + .5 - y;
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(x, iy, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(x, iy-1, r, g, b);
			}
      y += m;
      }
   }

void draw_line_x2(double x1, double y1, double x2, double y2) {
   int xstep, x, iy;
   double ofac, ffac, m, increment, y, r, g, b;
   m = (y2 - y1) / (x2 - x1);
   y = y1 + (floor(x1) + .5 - x1) * m;
   for (x = floor(x1); x > floor(x2); --x) {
      iy = floor(y);
		if (y > iy + .5) {
			ofac = y - (iy + .5);
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(x, iy, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(x, iy+1, r, g, b);
			}
		else {
			ofac = iy + .5 - y;
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(x, iy, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(x, iy-1, r, g, b);
			}
      y -= m;
      }
   }

void draw_line_y1(double x1, double y1, double x2, double y2) {
	int ystep, y, ix;
   double ofac, ffac, m, increment, x, r, g, b;
   m = (x2 - x1) / (y2 - y1);
   x = x1 + (floor(y1) + .5 - y1) * m;
   for (y = floor(y1); y < floor(y2); ++y) {
      ix = floor(x);
		if (x > ix + .5) {
			ofac = x - (ix + .5);
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(ix, y, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(ix+1, y, r, g, b);
			}
		else {
			ofac = ix + .5 - x;
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(ix, y, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(ix-1, y, r, g, b);
			}
      x += m;
      }

   }

void draw_line_y2(double x1, double y1, double x2, double y2) {
	int ystep, y, ix;
   double ofac, ffac, m, increment, x, r, g, b;
   m = (x2 - x1) / (y2 - y1);
   x = x1 + (floor(y1) + .5 - y1) * m;
   for (y = floor(y1); y > floor(y2); --y) {
      ix = floor(x);
		if (x > ix + .5) {
			ofac = x - (ix + .5);
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(ix, y, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(ix+1, y, r, g, b);
			}
		else {
			ofac = ix + .5 - x;
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(ix, y, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(ix-1, y, r, g, b);

			}
      x -= m;
      }

   }

void draw_line(double x1, double y1, double x2, double y2) {
	char *filename;
   if (fabs(x2 - x1) > fabs(y2 - y1) ){
	if (x2 > x1)
	draw_line_x1(x1, y1, x2, y2); 
	else
	draw_line_x2(x1, y1, x2, y2);
   }
      
   else{
	if(y2 > y1)
	draw_line_y1(x1, y1, x2, y2);
	else
	draw_line_y2(x1, y1, x2, y2);
   }
      
   }

int main(int argc, char** argv) {  
   int j, index, n = 40;
   double x1, y1, x2, y2, ctheta, stheta;
	char* filename = (char*) "Colored_antialiasedlines_without_gamma.bmp";

	if (argc > 1)
		n = atoi(argv[1]);
   if (argc > 2)
      gamma_correction = atoi(argv[2]);
	if (argc > 3)
		filename = argv[3];
	
	for (j = 0; j < width*height; ++j) {
		index = 3*j;
		image[index  ] = (unsigned char) 255.*background_color[0];
		image[index+1] = (unsigned char) 255.*background_color[1];
		image[index+2] = (unsigned char) 255.*background_color[2];
		}

	double radius = 180.0;
  	for (j = 0; j <= n; ++j) {
		x2 = 199.5 + radius*cos(2*M_PI*j/n);
		y2 = 199.5 + radius*sin(2*M_PI*j/n);
		if (j > 0)
     		draw_line(x1, y1, x2, y2);
		x1 = x2;
		y1 = y2;
		}
	write_bmp(filename, (char*) image, image_size, width);
	return 1;
	}