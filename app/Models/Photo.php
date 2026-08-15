<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    public const PERAN = ['cover', 'landing_typography', 'landing_strip', 'detail'];

protected $fillable = ['work_id', 'file_path', 'thumb_path', 'peran', 'urutan'];
    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }
}