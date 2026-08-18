<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\AboutController as AdminAboutController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PhotoController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\Admin\WorkController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

/* ---------------------------------------------------------------- *
 |  HALAMAN PUBLIC
 * ---------------------------------------------------------------- */

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/works', [PortfolioController::class, 'index'])->name('works.index');
Route::get('/works/{work:slug}', [PortfolioController::class, 'show'])->name('works.show');
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');

Route::post('/contact', [ContactController::class, 'kirim'])
    ->middleware('throttle:10,1')
    ->name('contact.kirim');

Route::get('/sitemap.xml', [HomeController::class, 'sitemap'])->name('sitemap');

/* ---------------------------------------------------------------- *
 |  LOGIN ADMIN
 * ---------------------------------------------------------------- */

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'tampil'])->name('login');
    Route::post('/login', [LoginController::class, 'masuk'])->middleware('throttle:6,1');
});

Route::post('/logout', [LoginController::class, 'keluar'])
    ->middleware('auth')
    ->name('logout');

/* ---------------------------------------------------------------- *
 |  HALAMAN ADMIN
 |  Semua binding memakai {model:id} — jangan pakai slug di admin,
 |  karena baris slide show tidak punya slug.
 * ---------------------------------------------------------------- */

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Works: satu tabel, tiga jenis (slide show / foto horizontal / work)
    Route::get('/works', [WorkController::class, 'index'])->name('works.index');
    Route::get('/works/create', [WorkController::class, 'create'])->name('works.create');
    Route::post('/works', [WorkController::class, 'store'])->name('works.store');
    Route::get('/works/{work:id}/edit', [WorkController::class, 'edit'])->name('works.edit');
    Route::post('/works/{work:id}', [WorkController::class, 'update'])->name('works.update');
    Route::delete('/works/{work:id}', [WorkController::class, 'destroy'])->name('works.destroy');

    // Aksi "Foto" = halaman detail (cover, link YouTube, foto zigzag)
    Route::get('/works/{work:id}/detail', [PhotoController::class, 'edit'])->name('works.detail');
    Route::post('/works/{work:id}/detail', [PhotoController::class, 'update'])->name('works.detail.update');
    Route::post('/works/{work:id}/zigzag', [PhotoController::class, 'tambahZigzag'])->name('works.zigzag.store');
    Route::post('/works/{work:id}/zigzag/drive', [PhotoController::class, 'tambahZigzagDrive'])->name('works.zigzag.drive');
    Route::post('/works/{work:id}/zigzag/urut', [PhotoController::class, 'urutkanZigzag'])->name('works.zigzag.urut');
    Route::delete('/photos/{photo:id}', [PhotoController::class, 'destroy'])->name('photos.destroy');

    // Kategori
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category:id}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::post('/categories/{category:id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category:id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Video
    Route::get('/videos', [VideoController::class, 'index'])->name('videos.index');
    Route::get('/videos/create', [VideoController::class, 'create'])->name('videos.create');
    Route::post('/videos', [VideoController::class, 'store'])->name('videos.store');
    Route::get('/videos/{video:id}/edit', [VideoController::class, 'edit'])->name('videos.edit');
    Route::put('/videos/{video:id}', [VideoController::class, 'update'])->name('videos.update');
    Route::delete('/videos/{video:id}', [VideoController::class, 'destroy'])->name('videos.destroy');

    // About
    Route::get('/about', [AdminAboutController::class, 'edit'])->name('about.edit');
    Route::post('/about', [AdminAboutController::class, 'update'])->name('about.update');
});