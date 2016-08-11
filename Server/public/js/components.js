var components = {};

components.info = function(text, index){
    if (text === undefined) {
        console.error("Component "+index+" was type 'info' but was given no 'content' field");
        return;
    }
    var spanH = document.createElement("span");
    spanH.className = "info";
    spanH.innerHTML = text;
    return spanH;
}

components.label = function(text, index){
    if (text === undefined) {
        console.error("Component "+index+" was type 'label' but was given no 'content' field");
        return;
    }
    var spanH = document.createElement("span");
    spanH.className = "label";
    spanH.innerHTML = text;
    return spanH;
}

components.text_button = function(text, callback, index){
    if (text === undefined) {
        console.error("Component "+index+" was type 'text-button' but was given no 'content' field");
        return;
    }
    if (callback === undefined) {
        console.error("Component "+index+" was type 'text-button' but was given no 'callback' field");
        // This one is fine, it just wont do anything
        callback = function(){};
    }
    var buttonH = document.createElement("button")
    buttonH.className = "text-button";
    var intxt = document.createElement("div");
    intxt.className = "btntxt";
    intxt.innerHTML = text;
    buttonH.appendChild(intxt);
    buttonH.onclick = callback;
    return buttonH;
}

components.color_button = function(color, callback, index){
    if (color === undefined) {
        console.error("Component "+index+" was type 'color-button' but was given no 'color' field");
        return;
    }
    if (callback === undefined) {
        console.error("Component "+index+" was type 'color-button' but was given no 'callback' field");
        // This one is fine, it just wont do anything
        callback = function(){};
    }
    var buttonH = document.createElement("button")
    buttonH.className = "color-button";
    buttonH.style = "background-color: "+color;
    buttonH.onclick = callback;
    return buttonH;
}

// Ehhhh
components.color_inline = function(group, index) {
    if (group === undefined) {
        console.error("Component "+index+" was type 'color-inline' but was given no 'group' field");
        return;
    }
    var cinline = document.createElement("div");
    cinline.className = "color-inline";
    group.forEach(function(elm, index, arr){
        cinline.appendChild(components.color_button(elm.color, elm.callback, index));
    })
    return cinline;
}

components.textbox = function(placeholder, validator, type, pattern, required, change) {
    var container = document.createElement("div");
    var txtbox = document.createElement("input");
    var valid = document.createElement("div");
    valid.className = "validIndicator";
    container.appendChild(valid);
    container.className = "textbox";
    txtbox.type = (type===undefined) ? "text" : type;
    if (pattern !== undefined) {
        txtbox.pattern = pattern;
    }
    if (required) {
        txtbox.required = true;
    }
    // if (validator !== undefined) {
    //     txtbox.onchange = validator;
    // }
    (function(ref, changecb){
        ref.onfocus = function() {
            $(ref.parentElement).addClass("active");
        }
        ref.onblur = function() {
            $(ref.parentElement).removeClass("active");
        }
        ref.addEventListener("keyup", function(event) {
            var setState = function(vald) {
                if (changecb !== undefined) {
                    changecb(ref.value, typeof vald === "number" ? false : vald);
                }
                if (vald === -1) {
                    $(ref.parentElement).removeClass("invalid");
                    $(ref.parentElement).removeClass("valid");
                    $(ref.parentElement).addClass("chk");
                    $(ref.parentElement.children[0]).addClass("spinner");
                    return;
                }
                if (vald) {
                    $(ref.parentElement).addClass("valid");
                    $(ref.parentElement).removeClass("invalid");
                    $(ref.parentElement).removeClass("chk");
                    $(ref.parentElement.children[0]).removeClass("spinner");
                } else {
                    $(ref.parentElement).addClass("invalid");
                    $(ref.parentElement).removeClass("valid");
                    $(ref.parentElement).removeClass("chk");
                    $(ref.parentElement.children[0]).removeClass("spinner");
                }
            }

            ref.checkValidity();

            if (validator !== undefined && ref.validity.valid) {
                setState(-1);
                validator(ref.value, setState);
            } else if (validator === undefined) {
                setState(ref.validity.valid);
            } else {
                setState(false);
            }

            if (changecb !== undefined) {
                changecb(ref.value, ref.validity.valid);
            }
        });
    })(txtbox, change);

    container.appendChild(txtbox);
    return container;
}
