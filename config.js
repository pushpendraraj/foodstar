configuration = {
    'projectName': 'Us',
    'imageDir': 'images',
    'logo':'logo.png',
    'avatar':'avatar-icon.png',
    'from_email':'rajput.pushpendra62@gmail.com',
    'from_name':'Pushpendra Rajput',
    'notificationMessages' : {
        userResiterSuccessNotify:'Registeration successfully, notification has been send to your register email and on register mobile number.',
        userResiterSuccess: 'Registeration successfully, will notify you soon.',
        invalidLogin:'<strong>Sorry</strong> ! Invalid email or password.',
        loginSuccess:'<strong>Thnak You</strong> ! User login successfully.',
        serverError:'<strong>Sorry</strong> ! Something went wrong, please try again after some time.',
        emailExist: `<strong>Sorry</strong> ! Email already register with us, don't know your password? go for forgot password.`,
        invalidEmail:`Invalid email address.`,
        invalidMobile:`Invalid mobile.`,
        requiredFullname:`Full name is required.`,
        requiredPassword:`password is required.`,
        invalidFieldValues:`You have enter invalid field values, please try again with valid data.`,
    },
    'enableMessage':true,
    'smsDeviceId':87449, //87419
}
module.exports = configuration;