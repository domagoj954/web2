var url = "http://localhost/web2/router.php";
var projekt = "p_dmacek";
var perPage = 10;



//--------forma za unos stadiona
function insertFormStadioni(page) {
    var output = '<table class="table table-hover"><tbody>';
    output += '<tr><th scope="col">ID</th><td><input hidden id="ID"></td></tr>';
    output += '<tr><th scope="col">IME</th><td><input type="text" id="IME"></td></tr>';
    output += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub"></td></tr>';
    output += '<tr><th scope="col">KAPACITET</th><td><input type="text" id="KAPACITET"></td></tr>';
    output += '<tr><th scope="col">ADRESA</th><td><input type="text" id="ADRESA"></td></tr>';
    output += '</table>';
    output += '<button type="button" class="btn btn-warning" id="spremiStadion">Spremi <i class="fas fa-save"></i></button> ';
    output += '<button type="button" class="btn btn-success" onclick="showStadioni(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
    $("#container").html(output);
}


//-------------------------------------------------------------
function showStadioni( page) {
    var tablica = '<br><button type="button" style="float:right;" class="btn btn-success" onclick="insertFormStadioni(' + page + ')">Insert <i class="fa fa-download" aria-hidden="true"></i></button><br><br>';
    tablica += '<table class="table table-hover"><tbody><thead><tr>';
    //tablica += '<th scope="col" input hidden">ID</th>';
    tablica += '<th scope="col">IME</th><th scope="col">IDklub</th><th scope="col">KAPACITET</th>';
    tablica += '<th scope="col">ADRESA</th>'
    tablica += '<th scope="col">ACTION</th></tr>';

    if (page == null || page == "") {
        page = 1;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: {"projekt": projekt, 
               "procedura": "p_get_stadion", 
               "perPage": perPage, 
               "page": page 
            },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;
            var count = jsonBody.count;


            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<td>' + v.IME + '</td>';
                    tablica += '<td>' + v.IDklub + '</td>';
                    tablica += '<td>' + v.KAPACITET + '</td>';
                    tablica += '<td>' + v.ADRESA + '</td>';
                    tablica += '<td><button type="button" class="btn btn-primary" onclick="showStadion(' + v.ID + ',' + page + ')">Edit <i class="fas fa-edit"></i></button> ';
                    tablica += '<button type="button" class="btn btn-danger" onclick="delStadion(' + v.ID + ',' + page + ')">Delete <i class="far fa-trash-alt"></i></button></td></tr>';
                });
                tablica += '</tbody></table>';
                tablica += pagination(page, perPage, count);
                $("#container").html(tablica);
            } else {
                if (errcode == 999) {
                    $("#container").html(loginForm);
                } else {
                    Swal.fire(message + '.' + errcode);
                }
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
//-----------------------------------------------------------------------------
function showStadion(ID, page) {
    var tablica = '<table class="table table-hover"><tbody>';
    $.ajax({
        type: 'POST',
        url: url,
        data: { "projekt": projekt, "procedura": "p_get_stadion", "ID": ID },
        success: function (data) {
            var jsonBody = JSON.parse(data);
            var errcode = jsonBody.h_errcode;
            var message = jsonBody.h_message;

            if (message == null || message == "", errcode == null || errcode == 0) {
                $.each(jsonBody.data, function (k, v) {
                    tablica += '<tr><th scope="col">ID</th><td><input hidden id="ID" value="' + v.ID + '"></td></tr>';
                    tablica += '<tr><th scope="col">IME</th><td><input type="text" id="IME" value="' + v.IME + '"></td></tr>';
                    tablica += '<tr><th scope="col">IDklub</th><td><input type="text" id="IDklub" value="' + v.IDklub + '"></td></tr>';
                    tablica += '<tr><th scope="col">KAPACITET</th><td><input type="text" id="KAPACITET" value="' + v.KAPACITET + '"></td></tr>';
                    tablica += '<tr><th scope="col">ADRESA</th><td><input type="text" id="ADRESA" value="' + v.ADRESA + '"></td></tr>';
                    tablica += '</table>';
                    tablica += '<button type="button" class="btn btn-warning" id="spremiStadion">Spremi <i class="fas fa-save"></i></button> ';
                    tablica += '<button type="button" class="btn btn-success" onclick="showStadioni(' + page + ')">Odustani <i class="fas fa-window-close"></i></button>';
                });
                $("#container").html(tablica);
            } else {
                if (errcode == 999) {
                    $("#container").html(loginForm);
                } else {
                    Swal.fire(message + '.' + errcode);
                }
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

//-----------------------SAVE STADION---------------------------
$(document).on('click', '#spremiStadion', function () {
    var ID = $('#ID').val();
    var IME = $('#IME').val();
    var IDklub = $('#IDklub').val();
    var KAPACITET = $('#KAPACITET').val();
    var ADRESA = $('#ADRESA').val();

    if (IME == null || IME == "") {
        Swal.fire('Molimo unesite ime stadiona');
    } else if (IDklub == null || IDklub == "") {
        Swal.fire('Molimo unesite IDklub stadiona');
    } else if (KAPACITET == null || KAPACITET == "") {
        Swal.fire('Molimo unesite kapacitet stadiona');
    } else if (ADRESA == null || ADRESA == "") {
        Swal.fire('Molimo unesite adresu stadiona');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                "projekt": projekt,
                "procedura": "p_save_stadion",
                "IME": IME,
                "IDklub": IDklub,
                "KAPACITET": KAPACITET,
                "ADRESA": ADRESA,
                "ID": ID,
                "ACTION": "edit"    
            },
            success: function (data) {
                var jsonBody = JSON.parse(data);
                var errcode = jsonBody.h_errcode;
                var message = jsonBody.h_message;
                console.log(data);

                if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                    Swal.fire('Uspješno se unijeli stadion');
                } else {
                    Swal.fire(message + '.' + errcode);
                }
                refresh();
                showStadioni();
            },
            error: function (xhr, textStatus, error) {
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
            },
            async: true
        });
    }
})

//-------------------Brisanje stadiona---------------
function delStadion(ID, page){
    Swal.fire({
        title: 'Želite li zaista obrisati stadion?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, obriši stadion!',
        cancelButtonText: 'Ipak nemoj!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    "projekt": projekt,
                    "procedura": "p_save_stadion",
                    "ID": ID,
                    "ACTION": "delete"
                },
                success: function (data) {
                    var jsonBody = JSON.parse(data);
                    var errcode = jsonBody.h_errcode;
                    var message = jsonBody.h_message;
                    console.log(data);

                    if ((message == null || message == "") && (errcode == null || errcode == 0)) {
                        Swal.fire(
                            'Uspješno ',
                            'ste obrisali stadion',
                            'success'
                        );
                    } else {
                        Swal.fire(message + '.' + errcode);
                    }
                    refresh();
                    showStadioni();
                },
                error: function (xhr, textStatus, error) {
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                },
                async: true
            });
        }
    })
}

