<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    protected $fillable = ['nama', 'slug', 'thumb_path', 'urutan'];

    protected $appends = ['thumb_url'];

    public function works(): HasMany
    {
        return $this->hasMany(Work::class);
    }

    /** Hanya work persegi yang tampil di halaman /works. */
    public function worksTampil(): HasMany
    {
        return $this->hasMany(Work::class)->where('jenis', Work::JENIS_WORK);
    }

    public function scopeUrut(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('nama');
    }

    public function getThumbUrlAttribute(): ?string
    {
        return $this->thumb_path
            ? Storage::disk('public')->url($this->thumb_path)
            : null;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}