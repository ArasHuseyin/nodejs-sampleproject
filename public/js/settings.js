class GeneralSettings {
    constructor() {

    }
    successMessage = (message) => {
        return `<div class="alert alert-success-alt alert-dismissable">
        <span class="glyphicon glyphicon-certificate"></span>
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
            ×</button>${message}</div>`;
    }

    errorMessage = (message) => {
        `<div class="alert alert-danger-alt alert-dismissable">
        <span class="glyphicon glyphicon-certificate"></span>
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
            ×</button>${message}</div>`;
    }

    updateStatus = (e) => {
        e.preventDefault();
        let status = $('.status-input').val();
        console.log(status.length)

        if (status.length > 0) {
            fetch('/settings/statusupdate', {
                method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    status: status
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res, "settings:13");
                    if (res.status === true) {
                        $('input').val('');
                        $(this.successMessage('Status updated succesfully')).insertAfter('.main-card');
                    } else if (res.status === false) {
                        $(this.errorMessage('Session expired! Redirecting...')).insertAfter('.main-card');
                        window.location.href = '/';
                    }
                })
                .catch(err => console.log(err));
        }

    }
    sendProfileImage = (event) => {
        event.preventDefault();
        var blobFile = $('.image-upload')[0].files[0];
        var formData = new FormData();
        formData.append("profile", blobFile);
        //-
        $.ajax({
            url: "/images/profile",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                console.log(response)
                $('#settings-profile').attr({
                    src: response.imgUrl,
                    title: "user-profile-image"
                });
            },
            error: (jqXHR, textStatus, errorMessage) => {
                console.log(errorMessage, jqXHR, textStatus);
            }
        });
    }
    loadProfileImage = () => {
        fetch('/images/profile', {
            method: 'GET',
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.img) {
                    console.log(res.img[0]);
                    console.log(res.img[0]);
                    $('#settings-profile').attr({
                        src: res.img[0],
                        title: "profile-image"
                    });

                }
            })
            .catch(error => console.log(error))
    }
}

class ChangePassword {
    constructor() {
        $('.save-changes').on('click', this.changePassword.bind(this));
    }

    message = (message, success) => {
        return success === true ? generalSettings.successMessage(message) : generalSettings.errorMessage(message);
    }

    changePassword = () => {
        const currentPassword = $('.current-password').val();
        const newPassword = $('.new-password1').val();
        const newPasswordToCompare = $('.new-password2').val();

        if (newPassword === newPasswordToCompare && currentPassword.length > 0 && newPassword.length > 0) {
            console.log(currentPassword,newPassword,newPasswordToCompare)
            fetch('/settings/changepassword', {
                method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    password: currentPassword,
                    newPassword: newPassword
                })
            }).then(res => res.json()).then(res => {
                if (res.status === true) {
                    $('input').val('');
                    $(this.message('Password udated succesfully', true)).prepend('.inputs-container');
                } else if (res.status === false && res.redirect == false && res.message > 0) {
                    $(this.message(res.message, false)).prepend('.inputs-container');
                } else if (res.status === false && res.redirect === true) {
                    $(this.message(`Session expired please click <a href="/">here</a> to sign in`, false)).prepend('.inputs-container');
                }
            })
        }else if(newPassword !== newPasswordToCompare ) {
            // alert -> folgt
        }
    }
}

$('body').on('click', () => {
    $('.alert').hide();
})

const generalSettings = new GeneralSettings();
const changePassword = new ChangePassword();

window.onload = generalSettings.loadProfileImage();
$('#save-changes-btn').on('click', (e) => {
    generalSettings.updateStatus(e);
    changePassword.changePassword(e);
});

$('.save-image').on('click', (e) => {
    generalSettings.sendProfileImage(e)
})