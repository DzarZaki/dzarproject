<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_id')->constrained()->cascadeOnDelete();

            $table->string('file_path');
            $table->string('thumb_path')->nullable();

            // slideshow = foto full screen (1 per baris slideshow)
            // thumb     = foto yang tampil di strip horizontal / grid works (1 per baris)
            // cover     = foto besar paling atas di halaman detail (1 per baris)
            // zigzag    = galeri zigzag di halaman detail (tanpa batas jumlah)
            $table->enum('penempatan', ['slideshow', 'thumb', 'cover', 'zigzag'])
                  ->default('zigzag');

            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();

            $table->index(['work_id', 'penempatan', 'urutan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};