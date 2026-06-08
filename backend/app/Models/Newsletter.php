<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    use HasFactory;
    
    protected $table = 'newsletter_subscribers'; // YEH ADD KARO
    protected $primaryKey = 'subscriber_id';     // YEH ADD KARO
    protected $fillable = ['email', 'is_active'];
    
    public $timestamps = true;                   // YEH ADD KARO
}