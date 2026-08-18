<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class About extends Model
{
    protected $fillable = [
        'label',
        'judul',
        'paragraf_1',
        'paragraf_2',
        'foto_portrait_path',
        'foto_portrait_thumb',
        'foto_full_path',
        'foto_full_thumb',
        'foto_pita_path',
        'foto_pita_thumb',
    ];

    protected $appends = ['portrait_url', 'full_url', 'pita_url'];

    /** Halaman About hanya punya satu baris data. */
    public static function singleton(): self
    {
        return static::firstOrCreate([], [
            'label' => 'About Us',
            'judul' => 'Authentic Archive',
        ]);
    }

    public function getPortraitUrlAttribute(): ?string
    {
        return $this->foto_portrait_path
            ? Storage::disk('public')->url($this->foto_portrait_thumb ?: $this->foto_portrait_path)
            : null;
    }

    public function getFullUrlAttribute(): ?string
    {
        return $this->foto_full_path
            ? Storage::disk('public')->url($this->foto_full_path)
            : null;
    }

    /** Foto memanjang hitam putih yang tampil di landing page. */
    public function getPitaUrlAttribute(): ?string
    {
        return $this->foto_pita_path
            ? Storage::disk('public')->url($this->foto_pita_path)
            : null;
    }
}