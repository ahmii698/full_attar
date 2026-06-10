<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;
    
    protected $table = 'blogs';
    protected $primaryKey = 'blog_id';
    protected $fillable = ['title', 'content', 'excerpt', 'image_url', 'category', 'tags', 'author', 'date', 'read_time'];
    
    public $timestamps = false;  // ← YEH CHANGE KARO
}