<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $table = 'newsletter_subscribers';
    protected $primaryKey = 'subscriber_id';
    protected $fillable = ['email', 'subscribed_at', 'is_active'];
    
    public $timestamps = false;
}