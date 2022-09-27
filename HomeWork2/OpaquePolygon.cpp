// include the required libraries and also include bmp

#include "bmp.h"
#include <cmath>
#include <iostream>
using namespace std;

// Here I am declaring my variables
#define width 400
#define height 400
#define imageSize width *height * 3

unsigned char image[imageSize];

int gamma_correction = 1;

void set_pixel_alpha(int x_axis, int y_axis, double red, double green, double blue, double alpha)
{
    int index;
    float transparency = 1 - alpha;
    float transp = (1 - alpha) / 255.0;
    if (x_axis >= 0 && x_axis < width && y_axis >= 0 && y_axis < height)
    {
        index = 3 * (x_axis + width * y_axis);
        if (gamma_correction)
        {
            image[index] = (unsigned char)(255.0 * sqrt(alpha * red + transp * (float)image[index]));
            image[index + 1] = (unsigned char)(255.0 * sqrt(alpha * green + transp * (float)image[index + 1]));
            image[index + 2] = (unsigned char)(255.0 * sqrt(alpha * blue + transp * (float)image[index + 2]));
        }
        else
        {
            image[index] = (unsigned char)(255 * alpha * red + transparency * (float)image[index]);
            image[index + 1] = (unsigned char)(255 * alpha * green + transparency * (float)image[index + 1]);
            image[index + 2] = (unsigned char)(255 * alpha * blue + transparency * (float)image[index + 2]);
        }
    }
}

void draw_traingle(double x1, double y1, double x2, double y2, double x3, double y3)
{
    double top_vertical = max(y1, max(y2, y3));
    double bottom_vertical = min(y1, min(y2, y3));
    int i, j, n = 40;
    double m_left, m_right, b_left, b_right, x_left, x_right;

    m_left = (y2 - y1) / (x2 - x1);

    m_right = (y3 - y2) / (x3 - x2);

    b_left = y2 - x2 * m_left;
    b_right = y2 - x2 * m_right;
    for (int y = floor(top_vertical); y > floor(bottom_vertical); y--)
    {
        if (x2 == x1)
        {
            x_left = x2;
        }
        else
        {
            x_left = (y - b_left) / m_left;
        }

        if (x3 == x2)
        {
            x_right = x3;
        }
        else
        {
            x_right = (y - b_right) / m_right;
        }

        for (float x = x_left; x < floor(x_right); x++)
        {
            set_pixel_alpha(floor(x), floor(y), 0, 0, 1, 1);
        }
    }
}

int main(int argc, char **argv)
{

    int i;

    // set image to black background
    for (i = 0; i < imageSize; ++i)
        image[i] = 0;

    draw_traingle(74.5, 175.5, 224.5, 325.5, 374.5, 175.5);
    draw_traingle(74.5, 325.5, 74.5, 175.5, 224.5, 325.5);
    draw_traingle(224.5, 325.5, 374.5, 175.5, 374.5, 325.5);
    draw_traingle(74.5, 175.5, 150.0, 100.0, 374.5, 175.5);
    draw_traingle(37.5, 175.5, 74.5, 325.5, 74.5, 175.5);
    draw_traingle(37.5, 175.5, 25.0, 125.0, 74.5, 175.5);

    write_bmp((char *)"OpaquePolygon.bmp", (char *)image, imageSize, width);
    return 1;
}
