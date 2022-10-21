#include "bmp.h"
#include <math.h>

#include <iostream>
using namespace std;

#define width 400
#define height 400
#define image_size 3*width*height

unsigned char image[image_size];
float background_color[3] = {.0, .2, .7}; // dark grenish blue
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

void draw_line_x(double x1, double y1, double x2, double y2) {  
   int xstep, xstart, xstop, x, iy, temp;
   double ofac, ffac, slope, increment, y, r, g, b;
   slope = (y2 - y1) / (x2 - x1);
   xstart = floor(x1);
   xstop = floor(x2);

//    similar to other one, here we are also swapping so that it will draw 
// the upper part of the circle as we did in the first part
	if (xstart >= xstop)
	{
		temp = xstart;
		xstart = xstop;
		xstop = temp;
	}
	

   y = y1 + (xstart + .5 - x1) * slope;
   for (x = xstart; x < xstop; ++x) { 
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
      y += slope;
      }
   }

void draw_line_y(double x1, double y1, double x2, double y2) {
	int xstep, ystart, ystop, y, ix, temp;
   double ofac, ffac, slope, increment, x, r, g, b;
   slope = (x2 - x1) / (y2 - y1);

   ystart = floor(y1);
   ystop = floor(y2);


// doing the same thing as we did 
// in part a. 

	if (ystart >= ystop)
	{
		temp = ystart;
		ystart = ystop;
		ystop = temp;
		x = floor(x2 + 0.05);
	}
	else {
		x = floor(x1 + 0.05);
	}
	
	cout << ystart << " , " << ystop << "\n";

   for (y = ystart; y <= ystop; ++y) { // this works only when x2 > x1
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
      	set_pixel(ix, y+1, r, g, b);
			}
		else {
			ofac = y + .5 - x;
			ffac = 1. - ofac;
			r = ofac*background_color[0] + ffac*line_color[0];
			g = ofac*background_color[1] + ffac*line_color[1];
			b = ofac*background_color[2] + ffac*line_color[2];
      	set_pixel(ix, y, r, g, b);
			r = ffac*background_color[0] + ofac*line_color[0];
			g = ffac*background_color[1] + ofac*line_color[1];
			b = ffac*background_color[2] + ofac*line_color[2];
      	set_pixel(ix, y-1, r, g, b);
			}
      x += slope;
      }  
   }

void draw_line(double x1, double y1, double x2, double y2) {
	char *filename;
   if (fabs(x2 - x1) > fabs(y2 - y1) )
      draw_line_x(x1, y1, x2, y2); 
   else
      draw_line_y(x1, y1, x2, y2);
   }

int main(int argc, char** argv) {  
   int i, index, n = 40;
   double x1, y1, x2, y2, theta, cenx, ceny, ctheta, stheta;
	char* filename = (char*) "Colored_antialiased_lines_no_gamma.bmp";

	if (argc > 1)
		n = atoi(argv[1]);
   if (argc > 2)
      gamma_correction = atoi(argv[2]);
	if (argc > 3)
		filename = argv[2];
	
	for (i = 0; i < width*height; ++i) {
		index = 3*i;
		image[index  ] = (unsigned char) 255.*background_color[0];
		image[index+1] = (unsigned char) 255.*background_color[1];
		image[index+2] = (unsigned char) 255.*background_color[2];
		}

	double radius = 180.;
	cenx = 199.5;
	ceny = 199.5;
  	for (i = 0; i <= n; ++i) {
     	theta = 2*M_PI*i/n; 
		x2 = cenx + radius*cos(theta);
		y2 = ceny + radius*sin(theta);
		if (i > 0)
     		draw_line(x1, y1, x2, y2);
		x1 = x2;
		y1 = y2;
		}
	//write_bmp(filename, (char*) image, image_size, width);
	write_bmp((char*) "Colored_antialiasedlines_x.bmp", (char*) image, image_size, width);
	return 1;
	}
