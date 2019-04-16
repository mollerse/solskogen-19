#!/usr/bin/env ruby -w

# pnginator.rb: pack a .js file into a PNG image with an HTML payload;
# when saved with an .html extension and opened in a browser, the HTML extracts and executes
# the javascript.

# Usage: ruby pnginator.rb input.js output.png.html

# By Gasman <http://matt.west.co.tt/>
# from an original idea by Daeken: http://daeken.com/superpacking-js-demos


MAX_WIDTH = 4096

require 'zlib'

input_filename, output_filename = ARGV

f = File.open(input_filename, 'rb')
js = f.read
f.close

if js.length < MAX_WIDTH
	# js fits onto one pixel line
	js += "\x00"
	scanlines = [js]
	width = js.length
	height = 1

	# p01's single-pixel-row bootstrap (requires an 0x00 end marker on the js string)
	html = "<button id=P>Play!</button><canvas id=C><img onload=b=C.getContext`2d`;S=String.fromCharCode;for(i=e='';t=b.getImageData(0,0,1,!b.drawImage(this,i--,0)).data[0];)e+=S(t);(1,eval)(e) src=#>"
else
	js = "\x00" + js
	width = MAX_WIDTH
	# split js into scanlines of 'width' pixels; pad the last one with whitespace
	scanlines = js.scan(/.{1,#{width}}/m).collect{|line| line.ljust(width, "\x00")}
	height = scanlines.length

	# p01's multiple-pixel-row bootstrap (requires a dummy first byte on the js string)
	html = "<button id=P>Play!</button><canvas id=C><img onload=for(w=C.width=#{width},a=C.getContext('2d'),a.drawImage(this,p=0,0),e='',d=a.getImageData(0,0,w,#{height}).data;t=d[p+=4];)e+=String.fromCharCode(t);(1,eval)(e) src=#>"
end

# prepend each scanline with 0x00 to indicate 'no filtering', then concat into one string
image_data = scanlines.collect{|line| "\x00" + line}.join
idat_chunk = Zlib::Deflate.deflate(image_data, 9) # 9 = maximum compression

def png_chunk(signature, data)
	[data.length, signature, data, Zlib::crc32(signature + data)].pack("NA4A*N")
end

File.open(output_filename, 'wb') do |f|
	f.write("\x89PNG\x0d\x0a\x1a\x0a") # PNG file header

	f.write(png_chunk("IHDR", [width, height, 8, 0, 0, 0, 0].pack("NNccccc")))

	# a custom chunk containing the HTML payload; stated chunk length is 4 less than the actual length,
	# leaving the final 4 bytes to take the place of the checksum
	f.write([html.length - 4, "jawh", html].pack("NA4A*"))

	# can safely omit the checksum of the IDAT chunk
	f.write([idat_chunk.length, "IDAT", idat_chunk].pack("NA4A*"))
end
