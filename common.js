//------include config.js------------------------------------------------
//var url = "https://dev.vub.zone/sandbox/router.php";
//var projekt = "p_common";
//var perPage = 10;

var url = "http://localhost/web2/router.php";
$(document).ready(function () {
    refresh();
});

document.writeln("<script type='text/javascript' src='login.js'></script>");

//------hendlanje link button-a----------------------------------
$("#loginBtn").click(function () {
    $("#container").html(loginForm);
});

$("#fanoviBtn").click(function () {
    showFanovi();
});

$("#kluboviBtn").click(function () {
    showKlubovi();
});


$("#igraciBtn").click(function () {
    showIgraci();
});

$("#treneriBtn").click(function () {
    showTreneri();
});

$("#predsjedniciBtn").click(function () {
    showPredsjednici();
});

$("#stadioniBtn").click(function () {
    showStadioni();
});

$("#ligeBtn").click(function () {
    showLige();
});

$("#logoutBtn").click(function () {
    logout();
});


//------------refersh-------------------------------------------------


//----------------login-------------------------------------------

$(document).on('click', '#getLogin', function () {
    var email = $('#inputEmail').val();
    var password = $('#inputPassword').val();
    if (email == null || email == "") {
        Swal.fire('Molimo unesite email adresu');
    } else if (password == null || password == "") {
        Swal.fire('Molimo unesite zaporku');
    } else {
        login();
    }
})

//----------------------------------------------------------------

//-----------ajaxSetup-------------------------------------------------------
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});


function login() {
    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": "p_common", "procedura": "p_login", "username": $('#inputEmail').val(), "password": $('#inputPassword').val()},//////////////////////////GRESKA projekt : projekt (projekt is undefined)
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $("#container").html('');
            } else {
                Swal.fire(message + '.' + errcode);
            }
            refresh();
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}

function refresh() {
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": "p_common", "procedura": "p_refresh" },
        success: function (data) {
           // console.log("Tu sam" + data); //////omogucilo rjesavanje greske ******////
            var jsonBody = JSON.parse(data);
            var podaci = '<small>ID:' + jsonBody.ID + '<br>' + 'ime prezime:' + jsonBody.IME + ' ' + jsonBody.PREZIME + '<br>' + 'email:' + jsonBody.EMAIL + '</small>';
            $("#podaci").html(podaci);
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true

    });
}

function logout() {
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": "p_common", "procedura": "p_logout" },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "" || errcode == null) {
                Swal.fire("Greška u obradi podataka, molimo pokušajte ponovno!");
            } else {
                Swal.fire(message + '.' + errcode);
            }
            refresh();
            $("#container").html('');
        },
        error: function (xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        },
        async: true
    });
}

function loginForm() {
    var output = "<br><br><form><div class='form-group'>";
    output += "<label for='inputEmail'>Email adresa</label>";
    output += "<input type='email' class='form-control' id='inputEmail' aria-describedby='emailHelp' placeholder='Enter email'></div>";
    output += "<div class='form-group'><label for='inputPassword'>Password</label>";
    output += "<input type='password' class='form-control' id='inputPassword' placeholder='Password'></div>";
    output += "<button class='btn btn-primary' id='getLogin'>Submit</button></form>";
    return output;
}

//----------------------------------------------------------------
function pagination(pageNmb, perPage, count) {
    //ne treba prikazivati ništa
    if (count < perPage) {
        return '';
    } else {
        var quotient = Math.ceil(count / perPage);
    }
    var next = pageNmb + 1;
    var prev = pageNmb - 1;
    var pagination = '<div class="float-right pagination">';

    //treba prikazati previous
    if (pageNmb > 1) {
        pagination += '<ul class="pagination"><li class="page-item "><a class="page-link" onclick="showFanovi(' + prev + ')" href="javascript:void(0)">‹</a></li>';
    }

    for (i = pageNmb; i < pageNmb + 8; i++) {
        pagination += '<li class="page-item"><a class="page-link" onclick="showFanovi(' + i + ')" href="javascript:void(0)">' + i + '</a></li>';
    }

    pagination += '<li class="page-item"><a class="page-link"  href="javascript:void(0)">...</a></li>';

    pagination += '<li class="page-item"><a class="page-link" onclick="showFanovi(' + quotient + ')" href="javascript:void(0)">' + quotient + '</a></li>';

    pagination += '<li class="page-item"><a class="page-link" onclick="showFanovi(' + next + ')" href="javascript:void(0)">›</a></li>';
    pagination += '</ul></div>';
    return pagination;
}


//--------forma za unos fanova
//