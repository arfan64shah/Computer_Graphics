#include "bmp.h"
#include <math.h>
#include <iostream>
using namespace std;

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

void draw_line_x(double x1, double y1, double x2, double y2) {  // only works if x2 > x1
   // cout << "Line is being drawn by x\n";
   int xstart, xstop, x, iy, temp;
   double m, y;
   m = (y2 - y1) / (x2 - x1);
   xstart = floor(x1);
   xstop = floor(x2);
   
   //  Here we are swapin the xstart and stop to 
   // draw the upper part of the cricle
   if (xstart >= xstop)
   {
      temp = xstart;
      xstart = xstop;
      xstop = temp;
      
   }

   y = y1 + m*(xstart + .5 - x1);
   

   for (x = xstart; x < xstop; ++x) {
      iy =floor(y);
      set_pixel(x, iy, 255, 255, 255); // for a white line on a black background
      y += m;
      }
   }


// This is the function that builds the circle in y axis
// It is pretty much similar to the above function that is drawing the circle in x_axis
// In this function, I have coppied the code from the above function and 
// changed the variables accordingly
void draw_line_y(double x1, double y1, double x2, double y2) {
   int ystart, ystop, y, ix, temp;
   double m, x;
   m = (x2 - x1) / (y2 - y1);
   ystart = floor(y1);
   ystop = floor(y2);
   
   if (ystart >= ystop)
   {
      temp = ystart;
      ystart = ystop;
      ystop = temp;
      x = floor( x2 + 0.05);
   }

   else{
      x = floor(x1 + 0.05);
   }
   
   for (y = ystart; y <= ystop; ++y) {
      ix =floor(x);
      set_pixel(ix, y, 255, 255, 255); // for a white line on a black background
      x += m;
      }
   }

void draw_line(double x1, double y1, double x2, double y2) {
   if (fabs(x2 - x1) > fabs(y2 - y1)){
      
      draw_line_x(x1, y1, x2, y2);
         }
   else{
      draw_line_y(x1, y1, x2, y2);
         }
   }

 int main(int argc, char** argv) {  
   int i, n = 100;
   double x1, y1, x2, y2, theta, cenx, ceny = 200., ctheta, stheta;
	
	// set image to black background
	for (i = 0; i < image_size; ++i)
		image[i] = 0;

   double radius = 180.;
   cenx = 199.5;
   ceny = 199.5;
   double deg;

   for (i = 0; i <= n; ++i) {
      theta = 2*M_PI*i/n; // for drawing a full circle; this version can only draw 1/4 of the cases
		// theta = (1.25 + .5*i/n)*M_PI;
      x2 = cenx + radius*cos(theta);
      y2 = ceny + radius*sin(theta);
      deg = theta * 180 / M_PI;
      
      
      
      if (i > 0)
         draw_line(x1, y1, x2, y2);
      x1 = x2;
      y1 = y2;
      
      }
      
	write_bmp((char*) "Line_x.bmp", (char*) image, image_size, width);
	return 1;
}
