<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $fillable = ['judul', 'teks', 'foto_path'];

    /** Halaman About hanya punya SATU baris data — ambil, atau buat kalau belum ada. */
    public static function singleton(): self
    {
        return self::firstOrCreate([]);
    }
}