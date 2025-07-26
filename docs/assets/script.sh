#!/bin/bash

mkdir -p gifs

for video in videos/*.mp4; do
    base=$(basename "$video" .mp4)
    palette="gifs/${base}_palette.png"
    gif="gifs/${base}.gif"

    echo "Processing $video -> $gif"

    # Step 1: Generate color palette
    ffmpeg -y -i "$video" -vf "fps=10,scale=640:-1:flags=lanczos,palettegen" "$palette"

    # Step 2: Generate GIF using palette
    ffmpeg -y -i "$video" -i "$palette" \
        -filter_complex "fps=10,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse" \
        "$gif"

    # Clean up palette
    rm "$palette"
done

