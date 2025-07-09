var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCFOgKO96AIJrURjKaPTdbjgtN6UQ9kz1rt-yA1tHFo9TmrjpY6m-00NAPwuIZ4_g5nU3kCKPWU4r9QPugXrReY",
    "privateKey": "OtpbNT_ZOqlUJzBszp00GtxPx7jh3DXot0gUbHclwyw"
};


webPush.setVapidDetails(
    'mailto:kristoforusnanda@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/elOV3ckrjn4:APA91bEbI34W2uypTqwtqIZMtejyKZWp1JB3SxOjwQuQqycM7U-ODitGwnKCr5MGEPCTzctICBMqg95lh9mnwjJ-rdKaoAJHZmFZ0ZqyTs_aj34TBp2Ar-OJo1bnWxA3Qe-OdkgSbLVO",
    "keys": {
        "p256dh": "BODrkIVTmbSl3XRwfFXyopDR9tmUJzg/2JZByqw4GaOIHYZQIVisr6vxltjtGZhVAImqsWVsx4MYcV4ar8CrSkU=",
        "auth": "/ktpiYiEd07vnHDMk0+RmA=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '816458845432',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);