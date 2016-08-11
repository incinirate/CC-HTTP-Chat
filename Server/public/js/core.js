function scaleAppBoxes(ov) {
    $(".sp_appbox").height(function(){
        var total = 0;
        var children = ov === undefined ? this.children[1].children[0].children : ov.children;
        for (var i = 0; i < children.length; i++) {
            //console.log(children[i])
            total += $(children[i]).outerHeight(true);
        }
        return total + "px";
    });
}

function initHeaders() {
    $(".appbox_header").toggleClass("init");
}

var i=0;

function testForm() {
    //i++;
    var nc = $(".appbox_content").clone();
    //var inf = nc.find(".info");
    //if (i%3!=0) {inf.html(inf.html() + "Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>Wow<br>");} else {inf.html("Hey, it looks like this is the first time you've logged in, so we're going to perform a first time setup.");}
    $(".appbox_content_wrapper").append(nc);
    $(nc).css("left","100%");
    $(nc).css("top","-100%");
    _ = window.getComputedStyle(nc[0]).left;
    _ = window.getComputedStyle(nc[0]).height;
    $(nc).css("left","0");
    //toggleClass("transition")
    nc.prevObject.css({"left":"-100%"})
    nc.one("transitionend webkitTransitionEnd oTransitionEnd", function(e){
        //console.log(e);
        $(nc.prevObject).remove();
        $(nc).css("top","0");
    });
    scaleAppBoxes(nc[0]);
}

function transitionContent(newContentObj) {
    //var newContentObj = $(newContentObjR).clone(true);
    var oldContent = $($(".appbox_content_wrapper")[0].children[0]);
    var newContent = $(".appbox_content_wrapper").append(newContentObj)[0].children[1];

    $(newContent).css("left","100%");
    $(newContent).css("top","-100%");
    _ = window.getComputedStyle(newContent).left;
    _ = window.getComputedStyle(newContent).height;
    $(newContent).css("left","0");
    //toggleClass("transition")
    oldContent.css({"left":"-100%"})
    $(newContent).one("transitionend webkitTransitionEnd oTransitionEnd", function(e){
        $(oldContent).remove();
        $(newContent).css("top","0");
    });
    scaleAppBoxes(newContent);
}

// This example contains all possible components
// Content example: [
//     {type: 'info', content: 'Hello World!'},
//     {type: 'text-button', content: 'Next', callback: func},
//     {type: 'color-button', color: '#42de22', callback: func},
//     {type: 'color-inline', group:[
//         // Color buttons here
//     ]},
//     {type: 'textbox', placeholder: 'Name', validator: func},
//     {type: 'seperator'}
// ]

function genContent(content) {
    var contentWrap = document.createElement("div");
    contentWrap.className = "appbox_content";

    content.forEach(function(value, index, arr){
        if (value.type===undefined) {
            console.error("Component "+index+" was given with no type, ignoring...");
            return;
        }

        switch (value.type) {
            case "info":
                contentWrap.appendChild(components.info(value.content, index));
                break;
            case "text-button":
                contentWrap.appendChild(components.text_button(value.content, value.callback, index));
                break;
            case "color-button":
                contentWrap.appendChild(components.color_button(value.color, value.callback, index));
                break;
            case "color-inline":
                contentWrap.appendChild(components.color_inline(value.group, index));
                break;
            case "textbox":
                contentWrap.appendChild(components.textbox(value.placeholder, value.validator, value.xtype, value.pattern, value.required, value.onchange));
                break;
            case "label":
                contentWrap.appendChild(components.label(value.content, index));
                break;
            case "seperator":
                console.warn("seperator NYI");
                break;
            default:
                console.error("Unkown component type " + value.type);
                break;
        }

        if (value.xid !== undefined) {
            contentWrap.children[contentWrap.children.length - 1].id = value.xid;
        }
    })

    return contentWrap;
}

$(document).ready(function() {
    var thanks = genContent([
        {type: 'info', content: LOCALE.FIRSTTIME_STARTUP_THANKS}
    ]);

    var btest = [false, false];
    var testBoth = function(id, state) {
        btest[id] = state;
        document.getElementById("advanceCreation").disabled = !(btest[0] && btest[1]);
    }

    var mcac = genContent([
        {type: 'info', content: LOCALE.FIRSTTIME_STARTUP_NEEDAC},
        {type: 'label', content: LOCALE.FIRSTTIME_STARTUP_UNAME},
        {type: 'textbox', placeholder: LOCALE.FIRSTTIME_STARTUP_UNAME, required: true, pattern: '[a-zA-Z0-9]+', validator: function(info, cb) {
            //console.log("Val me bro");
            var userId = firebase.auth().currentUser;
            if (userId === null) {
                console.error("Not signed in, handle this in the future");
                cb(false);
            }
            userId = userId.uid;
            firebase.database().ref("/users/list/"+info).once("value").then(function(snapshot){
                // console.log("We here");
                // console.log(snapshot.val());
                cb(snapshot.val() === null);
            })
        }, onchange: function(t, valid) {
            testBoth(0, valid);
        }},
        {type: 'label', content: LOCALE.FIRSTTIME_STARTUP_PWD},
        {type: 'textbox', placeholder: LOCALE.FIRSTTIME_STARTUP_PWD, xtype: 'password', pattern: '.{6,}', required: true, onchange: function(t, valid) {
            testBoth(1, valid);
        }},
        {type: 'text-button', content: "Next", callback: function(){
            var adb = mcac.querySelector("#advanceCreation");
            var spn = document.createElement("div");
            spn.className = "spinner";
            adb.appendChild(spn); //calc(16px - 0.5em);
            _ = window.getComputedStyle(spn).top;
            $(spn).css("top", "calc(16px - 0.5em)");
            var txt = adb.querySelector(".btntxt");
            console.log(txt);
            $(txt).css("top", "34px");
            //transitionContent(thanks)
            setTimeout(function() {
                transitionContent(thanks);
            }, 1500);
        }, xid: "advanceCreation"}
    ]);
    var adb = mcac.querySelector("#advanceCreation");
    if (adb !== undefined) {
        adb.disabled = true;
    }

    var greeting = genContent([
        {type: 'info', content: LOCALE.FIRSTTIME_STARTUP_WELCOME},
        {type: 'text-button', content: "Next", callback: function(){transitionContent(mcac);}}
    ]);

    $(".appbox_content_wrapper").append(greeting);

    scaleAppBoxes();
    initHeaders();
    _ = window.getComputedStyle($(".sp_appbox")[0]).height;
    scaleAppBoxes();
});
