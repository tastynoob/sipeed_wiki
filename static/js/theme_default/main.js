
(function () {
    var elements = document.getElementsByTagName("pre");
    for(var i=0; i<elements.length; ++i){
        elements[i].classList.add("language-none");
        elements[i].classList.add("line-numbers");
    }
    // $('pre').addClass("language-none");
    // $('pre').addClass("line-numbers").css("white-space", "pre-wrap");
}());

window.onload = function(){
}

$(document).ready(function(){
    $("#sidebar ul .show").slideDown(200);
    registerSidebarClick();
    addTOC();
    addSplitter();
    registerOnWindowResize();
    hello();
    focusSidebar();
});

var sidebar_width = "300px";
var sidebar_width_is_percent = false;
try{
    if(isNaN(sidebar_width)){
        if(sidebar_width.endsWith("px")){
            sidebar_width = parseInt(sidebar_width.substr(0, sidebar_width.length-2));
        }else if(sidebar_width.endsWith("%")){
            sidebar_width = parseInt(sidebar_width.substr(0, sidebar_width.length-1));
            sidebar_width_is_percent = true;
        }else{
            sidebar_width = parseInt(sidebar_width);
        }
    }
}catch(err){
    alert('plugin theme env sidebar_width value error, e.g. 300 or "300px" or "30%", not ' + sidebar_width);
}

function registerSidebarClick(){
    function show_collapse_item(a_obj){
        var o_ul = a_obj.next();
        var collapsed = !o_ul.hasClass("show");
        if(collapsed){
            o_ul.slideDown(200);
            o_ul.removeClass("collapsed");
            o_ul.addClass("show");
            a_obj.children(".sub_indicator").removeClass("sub_indicator_collapsed");
        }else {
            o_ul.slideUp(200);
            o_ul.removeClass("show");
            o_ul.addClass("collapsed");
            a_obj.children(".sub_indicator").addClass("sub_indicator_collapsed");
        }
    }
    $("#sidebar ul li > a").bind("click", function(e){
        var is_click_indicator = $(e.target).hasClass("sub_indicator");
        var a_obj = $(this);
        if(a_obj.attr("href") == window.location.pathname){
            show_collapse_item(a_obj);
            return false;
        }
        show_collapse_item(a_obj);
        if(is_click_indicator){ // click indicator, only collapse, not jump to link
            return false;
        }
    });
    $("#menu").bind("click", function(e){
        if(!$("#sidebar_wrapper").is(':visible')){ // show
            $("#menu").addClass("m_menu_fixed");
            $("#menu").addClass("close");
            $("#to_top").addClass("m_hide");
            $("#sidebar_wrapper").show(100);
            $(".gutter").css("display", "block");
        }else{ // hide
            $("#menu").removeClass("m_menu_fixed");
            $("#menu").removeClass("close");
            $("#to_top").removeClass("m_hide");
            $("#sidebar_wrapper").hide(100);
            $(".gutter").css("display", "none");
        }
    });
    $("#navbar_menu_btn").bind("click", function(e){
        $("#navbar_items").toggle();
    });
    var theme = getTheme();
    setTheme(theme);
    $("#themes").bind("click", function(e){
        var theme = getTheme();
        if(theme == "light"){
            setTheme("dark");
        }else {
            setTheme("light");
        }
    });
    $("#to_top").bind("click", function(e){
        window.scrollTo({
                            top: 0, 
                            behavior: "smooth" 
                        });
        return false;
    });
}

function hello(){
    console.log('\n\n\
     _                _            \n\
    | |              | |           \n\
    | |_ ___  ___  __| | ___   ___ \n\
    | __/ _ \\/ _ \\/ _` |/ _ \\ / __|\n\
    | ||  __/  __/ (_| | (_) | (__ \n\
     \\__\\___|\\___|\\__,_|\\___/ \\___|\n\
                                         \n\
                 generated by teedoc:            \n\
                                                 \n\
                 https://github.com/teedoc/teedoc\n\
                                                 \n\n\n\
');
}


function addTOC(){
    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '#toc_content',
        // Where to grab the headings to build the table of contents.
        contentSelector: '#content_body',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h2, h3, h4',
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        });
}



function getSplitter(){
    var sizes = localStorage.getItem("splitter_w");
    if(sizes){
        try
        {
        sizes = JSON.parse(sizes);
        }
        catch(err)
        {
            sizes = false;
        }
    }
    if(!sizes){
        var screenW = $(window).width();
        var split_w = 0;
        if(!sidebar_width_is_percent){
            split_w = parseInt(sidebar_width/screenW*100);
        }else{
            split_w = sidebar_width;
        }
        sizes = [split_w, 100-split_w];
        setSplitter(sizes);
    }
    return sizes;
}
function setSplitter(sizes){
    localStorage.setItem("splitter_w", JSON.stringify(sizes));
}

var hasSplitter = false;

function createSplitter(){
    var split = Split(["#sidebar_wrapper", "#article"],{
        gutterSize: 10,
        gutterAlign: 'start',
        minSize: 200,
        elementStyle: function (dimension, size, gutterSize) {
            return {
                'width': 'calc(' + size + '% - ' + gutterSize + 'px)',
            }
        },
        onDragEnd: function (sizes) {
            setSplitter(sizes)
        },
    });
    hasSplitter = true;
    var screenW = $(window).width();
    var sizes = getSplitter();
    split_w = parseInt(sizes[0]);
    if(isNaN(split_w) || (split_w + 20) >= screenW){
    if(!sidebar_width_is_percent){
    split_w = parseInt(sidebar_width/screenW*100);
    }else{
    split_w = sidebar_width;
    }
    }
    split.setSizes([split_w, 100 - split_w]);
    $(".gutter").hover(function(){
    $(".gutter").css("width", "18px");
    },function(){
    $(".gutter").css("width", "10px");
    });
}

function addSplitter(){
    var screenW = $(window).width();
    if(screenW > 900)
    {
        createSplitter();
    }
}

function registerOnWindowResize(){
    window.onresize = function(){
        var screenW = $(window).width();
        console.log(screenW);
        if(screenW < 900){
            console.log($("#sidebar_wrapper").attr("style"));
            $("#sidebar_wrapper").removeAttr("style");
            if($("#menu").hasClass("close")){
                $("#sidebar_wrapper").css("display", "block");    
            }
            $(".gutter").css("display", "none");
        }else{
            if(!hasSplitter){
                createSplitter();
            }
            if($("#sidebar_wrapper").css("display") != "none"){
                $(".gutter").css("display", "block");
            }
        }
    }
}

function focusSidebar(){
    var windowH = window.innerHeight;
    var active = $("#sidebar .active")[0];
    var offset = active.offsetTop;
    if(offset > windowH/2){
        $("#sidebar .show").scrollTop(offset);
    }
}

