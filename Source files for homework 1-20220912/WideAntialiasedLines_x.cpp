#include "bmp.h"
#include <math.h>
#define width 400
#define height 400
#define image_size 3*width*height

unsigned char image[image_size];
int gamma_correction = 1;
int circle = 1;
float line_width = 2.0;

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
   int i, xstart, xstop, x, iy, im, ip, ilm, irm, ilp, irp;
   double m, ofac, ffac, dx, y, yl, yr, d, ratio, part, opart, middle;
   m = (y2 - y1) / (x2 - x1);
   xstart = floor(x1);
   xstop = floor(x2);
   y = y1 + m*(xstart + .5 - x1);
	d = sqrt(1 + m*m)*line_width/2.;
   for (x = xstart; x < xstop; ++x) {
		middle = 0;
      iy = floor(y);
		yl = y - .5*m;
		yr = y + .5*m;
		ilm = floor(yl - d);
		ilp = floor(yl + d);
		irm = floor(yr - d);
		irp = floor(yr + d);
		if (irm == ilm) {
			if (irm == iy) {
				middle += d;
				}
			else {
				middle += y - iy;
				ffac = irm + 1 - (y - d);
				ofac = 1 - ffac;
				set_pixel(x, irm, ffac, ffac, ffac);
				for (i = irm + 1; i < iy; ++i)
					set_pixel(x, i, 1., 1., 1.);
				}
			}
		else {
			if (m > 0) {  // so ilm < irm
				ratio = (ilm + 1 -(yl - d))/(yr - d - irm);
				im = ilm;
				}
			else {
				ratio = (irm + 1 - (yr - d))/(yl - d - ilm);
				im = irm;
				}
			dx = ratio/(1 + ratio);
			ffac = .5*fabs(m)*dx*dx; // area of a triangle with sides dx and m*dx
			ofac = 1. - ffac;
			set_pixel(x, im, ffac, ffac, ffac);
			if (im + 1 == iy)
				middle += d - ffac;
			else {
				part = im + 2 - (y-d) - ffac;
				opart = 1 - part;
				set_pixel(x, im+1, part, part, part);
				for (i = im + 2; i < iy; ++i)
					set_pixel(x, i, 1., 1., 1.);
				}
			}
		if (irp == ilp) {
			if (irp == iy) 
				middle += d;
			else {
				middle += iy + 1 - y;
				ffac = y + d - irp;
				ofac = 1 - ffac;
				set_pixel(x, irp, ffac, ffac, ffac);
				for (i = irp - 1; i > iy; --i)
					set_pixel(x, i, 1., 1., 1.);
				}
			}
		else {
			if (m > 0) {  // so ilp < irp
				ratio = (ilp + 1 -(yl + d))/(yr + d - irp);
				ip = irp;  // these are reversed because ratio is reversed in computing dx and fac
				}
			else {
				ratio = (irp + 1 - (yr + d))/(yl + d - ilp);
				ip = ilp;
				}
			dx = 1/(1 + ratio);
			if(0)
			printf("x %d m %f ilp %d irp %d ip %d ratio %f dx %f\n", x, m, ilp, irp, ip, ratio, dx);
			ffac = .5*fabs(m)*dx*dx; // area of a triangle with sides dx and m*dx
			ofac = 1. - ffac;
			set_pixel(x, ip, ffac, ffac, ffac);
			// set_pixel(x, ip, ofac, 1, ofac);
			if (ip - 1 == iy)
				middle += d - ffac;
			else {
				part = y + d - (ip - 1) - ffac;
				opart = 1 - part;
				set_pixel(x, ip-1, part, part, part);
				// set_pixel(x, ip-1, opart, 1, opart);
				for (i = ip - 2; i > iy; --i)
					set_pixel(x, i, 1., 1., 1.);
				}
			}
		if (ip - 1 > iy || im + 1 < iy) {
			middle = 1;
			if(0)
				printf("set middle to 1 at point %d %d\n", x, iy);
			}
		if (middle == 0.)
			printf("x %d y %f iy %d yl %f yr %f ilm %d irm %d im %d ilp %d irp %d ip %d middle %f\n",
				x, y, iy, yl, yr, ilm, irm, im, ilp, irp, ip, middle);
		ffac = middle;
		ofac = 1. - ffac;
		set_pixel(x, iy, ffac, ffac, ffac);
      y += m;
      }
   }

void draw_line_y(double x1, double y1, double x2, double y2) {
	return;
   }


 void draw_line(double x1, double y1, double x2, double y2) {
	char *filename;
   if (fabs(x2 - x1) > fabs(y2 - y1) )
      draw_line_x(x1, y1, x2, y2); 
   else
      draw_line_y(x1, y1, x2, y2);
   }

 int main(int argc, char** argv) {  
   int i, n = 10;
   double x1, y1, x2, y2, theta, cenx, ceny = 200., ctheta, stheta;
	char* filename = (char*) "White_wide_antialiased_lines_2.bmp";

	if (argc > 1)
		n = atoi(argv[1]);
	if (argc > 2)
		gamma_correction = atoi(argv[2]);
	if (argc > 3)
		line_width = atof(argv[3]);
	if (argc > 4)
		filename = argv[4];
	
	// set image to black background
	for (i = 0; i < image_size; ++i)
		image[i] = 0.;

	double radius = 180.;
	cenx = 199.5;
	ceny = 199.5;
   for (i = 0; i <= n; ++i) {
     	theta = (1.25 + .5*i/n)*M_PI;
		printf("theta %f\n", theta*180/M_PI);
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
