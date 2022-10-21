// taken from https://gitlab.com/lmcnulty/bmp-encoder/-/blob/master/bmp.h
// and explained at https://lmcnulty.me/words/bmp-output/
#include <stdio.h>
#include <stdlib.h>

int round4(int x) {
	return x % 4 == 0 ? x : x - x % 4 + 4;
}

void write_bmp(char *filename, char rgb[], int length, int width) {
	int height = (length / 3) / width;
	int bitmap_size = height * round4(width * 3);
	// Allocate a buffer to store the bitmap data. Fill it with zeros so
	// we don't leave any traces of our memory in unused spaces.
	char *bitmap = (char *) malloc(bitmap_size * sizeof(char));
	for (int i = 0; i < bitmap_size; i++) bitmap[i] = 0;

	for (int row = 0; row < height; row++) {
		// Copy pixel data in BGR order, padding each row to the
		// next multiple of 4 bytes.
		for (int col = 0; col < width; col++) {
			for (int color = 0; color < 3; color++) {
				bitmap[row * round4(width * 3) + col * 3 + color] 
				= rgb[3*(row * width + col) + (2 - color)];
			}
		}
	}
	// Indicates that the file is a BMP
	char tag[] = { 'B', 'M' };
	int header[] = {
		0,                   // File size... update later.
		0,                   // Unused
		0x36,                // The byte offset of pixel data 
		0x28,                // Header Size
		width, height,       // Image dimensions in pixels
		0x180001,            // 24 bits/pixel, 1 color plane
		0,                   // BI_RGB no compression
		0,                   // Pixel data size in bytes (Unused)
		0x002e23, 0x002e23,  // Print resolution
		0, 0,                // No color palette
	};
	// Update file size
	header[0] = sizeof(tag) + sizeof(header) + bitmap_size;

	FILE *fp = fopen(filename, "w+");
	fwrite(&tag, sizeof(tag), 1, fp);
	fwrite(&header, sizeof(header), 1, fp);
	fwrite(bitmap, bitmap_size * sizeof(char), 1, fp);
	fclose(fp);
	
	free(bitmap);
}

