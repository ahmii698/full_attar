<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactQuery extends Model
{
    use HasFactory;
    
    protected $table = 'contact_queries';    // YEH ADD KARO
    protected $primaryKey = 'query_id';      // YEH ADD KARO
    protected $fillable = ['full_name', 'email', 'phone', 'query_date', 'message', 'is_read'];
    
    public $timestamps = true;               // YEH ADD KARO
}