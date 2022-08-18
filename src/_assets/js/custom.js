$(document).ready(function () {
    $(".notifybtn").click(function(){
       $(".action-footbx").addClass('alert-open');
    });
    $(".subcheckbtn").click(function(){
       $(".action-footbx").removeClass('alert-open');
    });
});
$('.editbtn').on('click', function(){
   $('.cstm-dropdown').toggleClass('active');
});
$('.savebtn .btn').on('click', function(){
   $('.cstm-dropdown').removeClass('active');
});

$('.editag').on('click', function(){
   $('.adrop-container').toggleClass('open');
});
$('.cancelbtn .btn').on('click', function(){
   $('.adrop-container').removeClass('open');
});
