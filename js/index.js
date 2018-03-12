var scaling = 1.50;
//count
var showCount = 5;
var currentSliderCount = 0;
var controlsWidth = 40;
var scollWidth = 0;
var prev = $(".prev");  
var next = $(".next");
var prevv = $(".prevv");
var nextt = $(".nextt");
var prevs = $(".prevs");
var nexts = $(".nexts");

$(document).ready(function(){
    //$('.slider-container .slide:nth-last-child(-n+4)').prependTo('.slider-container');
    init(showCount);
    
});
$( window ).resize(function() {
    init(showCount);
});
function init(showCount){
    // elements
    var win = $(window);
    var sliderFrame = $(".slider-frame");
    var sliderFrame2 = $(".slider-frame2");
    var sliderFrames = $(".slider-frames");
    var sliderContainer = $(".slider-container");
    var sliderContainer2 = $(".slider-container2");
    var sliderContainers = $(".slider-containers");
    var slide = $(".slide");
    var slidee = $(".slidee");
    var slides = $(".slides");
    
    //counts
    var scollWidth = 0;
    var windowWidth = win.width();
    
    //sizes
    var frameWidth = win.width() - 440;
    if(windowWidth >= 0 && windowWidth <= 414){
       showCount = 2;
    }else if(windowWidth >= 414 &&  windowWidth <= 768){
       showCount = 3;
    }else{
       showCount = 5;
    }    
    var videoWidth = ((windowWidth - controlsWidth*2 - showCount*2) / (showCount+2) );
    var videoHeight = Math.round(videoWidth / (16/9));
    var videoWidthDiff = (videoWidth * scaling) - videoWidth;
    var videoHeightDiff = (videoHeight * scaling) - videoHeight;
    
    //set sizes
    sliderFrame.width(frameWidth);
    sliderFrame.height(videoHeight * scaling + 28);
    sliderContainer.height(videoHeight * scaling);
    sliderContainer.width((videoWidth * 45) + videoWidthDiff);
    sliderContainer.css("top", (videoHeightDiff / 2));
    slide.height(videoHeight);
    slide.width(videoWidth);

    prev.height(videoHeight-2);
    next.height(videoHeight-2);
    
    slides.height(videoHeight+50);
    slides.width(videoWidth-20);
    prevs.height(videoHeight-2);
    nexts.height(videoHeight-2);

    var videoWidth2 = ((windowWidth-400 - controlsWidth * 2) / (showCount+1) );
    var videoHeight2 = Math.round(videoWidth2 / (16/9));
    sliderFrames.width(frameWidth);
    sliderFrames.height(videoHeight * scaling + 78);
    // sliderFrame.css("margin-left", '50px');
    // sliderFrame.css("margin-right", '90px');
    //sliderFrame.css("top", (videoHeightDiff / 2));
    sliderContainers.height(videoHeight * scaling+50);
    sliderContainers.width((videoWidth * 45) + videoWidthDiff);
    sliderContainers.css("top", (videoHeightDiff / 2));
    // sliderContainer.css("margin-left", (controlsWidth));
    var videoWidth2Diff = (videoWidth2 * scaling) - videoWidth2;
    var videoHeight2Diff = (videoHeight2 * scaling) - videoHeight2;
    //set sizes
    sliderFrame2.width('100%');
    sliderFrame2.height(videoHeight2 * scaling + 28);
    sliderContainer2.height(videoHeight2 * scaling);
    sliderContainer2.width((videoWidth2 * 45) + videoWidth2Diff);
    sliderContainer2.css("top", (videoHeight2Diff / 2));
    // sliderContainer2.css("margin-left", (controlsWidth));
    slidee.height(videoHeight2);
    slidee.width(videoWidth2);
    prevv.height(videoHeight2-2);
    nextt.height(videoHeight2-2);
    //hover effect
    $(".slide").mouseover(function() {
        $(this).css("width", videoWidth * scaling);
        $(this).css("height", videoHeight * scaling);
        $(this).css("top", -(videoHeightDiff / 2));
        $(this).css("z-index", 200);
        // if($(".slide").index($(this)) == 0){
        //   // do nothing
        //   var slidercontainer = $(this)
        //   slidercontainer.animate({
        //         left: + 40
        //     }, 10)
        // }
        // if($(".slide").index($(this)) > 0 && $(".slide").index($(this)) % 4 == 0){
        //   // do nothing
        //   var slidercontainer = $(this)
        //   slidercontainer.animate({
        //         left: - 120
        //     }, 10);
        // }
        
    }).mouseout(function() {
        $(this).css("width", videoWidth+2);
        $(this).css("height", videoHeight+2);
        $(this).css("top", 0);
        $(this).css("z-index", 0);
        // if($(".slide").index($(this)) == 0){
        //   // do nothing
        //   var slidercontainer = $(this)
        //   slidercontainer.animate({
        //         left: - 0
        //     }, 10);
        // }
        // if($(".slide").index($(this)) > 0 && $(".slide").index($(this)) % 4 == 0){
        //   // do nothing
        //   var slidercontainer = $(this)
        //   slidercontainer.animate({
        //         left: + 0
        //     }, 10);
        // }
    });
    
    $(".slidee").mouseover(function() {
        $(this).css("width", videoWidth2 * scaling);
        $(this).css("height", videoHeight2 * scaling);
        $(this).css("top", -(videoHeight2Diff / 2));
        $(this).css("z-index", 200);
        // if($(".slidee").index($(this)) == 0){
        //   // do nothing
        //   var slidercontainer = $(this)
        //   slidercontainer.animate({
        //         left: + 40
        //     }, 10)
        // }
        
    }).mouseout(function() {
        $(this).css("width", videoWidth2);
        $(this).css("height", videoHeight2);
        $(this).css("top", 0);
        $(this).css("z-index", 0);
        // if($(".slidee").index($(this)) == 0){
        //   // do nothing
        //   var slidercontainer = $(this)
        //   slidercontainer.animate({
        //         left: - 0
        //     }, 10);
        // }
    });

    // controls
    controls(frameWidth, scollWidth, showCount);
}

function controls(frameWidth, scollWidth, showCount){

    next.on("click", function(){
        var slidercontainer = $(this).next(".slider-container");
        var videoCount = slidercontainer.children().length-1;
        var sliderCount = parseInt(videoCount / showCount);
        console.log(videoCount)
        console.log(sliderCount)
        console.log(currentSliderCount)
        if(currentSliderCount<sliderCount && videoCount!=showCount){
            // scollWidth = scollWidth + frameWidth;
            slidercontainer.animate({
                left: - frameWidth
            }, 50, function(){ 
                // if(currentSliderCount >= videoCount){
                //     slidercontainer.css("left", 0);
                //     currentSliderCount = showCount;
                //     scollWidth = 0;
                // }else{
                    currentSliderCount+=1;
                // }
            });
        }
    });

    prev.on("click", function(){
        var slidercontainer = $(this).next().next(".slider-container");
        var videoCount = slidercontainer.children().length-1;
        var sliderCount = parseInt(videoCount / showCount);
        console.log(videoCount)
        console.log(sliderCount)
        if(currentSliderCount>0){
            // scollWidth = (scollWidth - frameWidth);
            slidercontainer.animate({
                left: 0
            }, 50, function(){ 
                currentSliderCount-=1;
            });
        }
    });

    nexts.on("click", function(){
        var slidercontainer = $(this).next(".slider-containers");
        var videoCount = slidercontainer.children().length-1;
        var sliderCount = parseInt(videoCount / showCount);

        if(currentSliderCount<sliderCount){
            // scollWidth = scollWidth + frameWidth;
            slidercontainer.animate({
                left: - frameWidth
            }, 50, function(){ 
                // if(currentSliderCount >= videoCount){
                //     slidercontainer.css("left", 0);
                //     currentSliderCount = showCount;
                //     scollWidth = 0;
                // }else{
                    currentSliderCount+=1;
                // }
            });
        }
    });

    prevs.on("click", function(){
        var slidercontainer = $(this).next().next(".slider-containers");
        var videoCount = slidercontainer.children().length-1;
        var sliderCount = parseInt(videoCount / showCount);
        console.log(videoCount)
        console.log(sliderCount)
        if(currentSliderCount>0){
            // scollWidth = (scollWidth - frameWidth);
            slidercontainer.animate({
                left: 0
            }, 50, function(){ 
                currentSliderCount-=1;
            });
        }
    });

    nextt.on("click", function(){
        var slidercontainer = $(this).next(".slider-container2");
        var videoCount = slidercontainer.children().length-1;
        var sliderCount = parseInt(videoCount / showCount);

        if(currentSliderCount<sliderCount){
            // scollWidth = scollWidth + frameWidth;
            slidercontainer.animate({
                left: - frameWidth+320
            }, 50, function(){ 
                // if(currentSliderCount >= videoCount){
                //     slidercontainer.css("left", 0);
                //     currentSliderCount = showCount;
                //     scollWidth = 0;
                // }else{
                    currentSliderCount+=1;
                // }
            });
        }
    });

    prevv.on("click", function(){
        var slidercontainer = $(this).next().next(".slider-container2");
        var videoCount = slidercontainer.children().length-1;
        var sliderCount = parseInt(videoCount / showCount);
        console.log(videoCount)
        console.log(sliderCount)
        if(currentSliderCount>0){
            // scollWidth = (scollWidth - frameWidth);
            slidercontainer.animate({
                left: 0
            }, 50, function(){ 
                currentSliderCount-=1;
            });
        }
    });
};