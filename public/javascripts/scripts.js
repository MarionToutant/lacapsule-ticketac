$("#datepicker-box").hide();
$("#btn-search").hide();
$(function() {
    $( "#datepicker" ).datepicker({dateFormat: "dd/mm/yy"});
});
$("#btn-datepicker").on('click', function(){
    $("#datepicker-box").show();
    $("#btn-search").show();
    $("#btn-datepicker").hide();
});

$("#btn-confirm").on('click', function(){
    $("#toast-confirm").toast('show');
});



