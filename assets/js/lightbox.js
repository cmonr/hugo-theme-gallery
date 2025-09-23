import PhotoSwipeLightbox from "./photoswipe/photoswipe-lightbox.esm.js";
import PhotoSwipe from "./photoswipe/photoswipe.esm.js";
import PhotoSwipeDynamicCaption from "./photoswipe/photoswipe-dynamic-caption-plugin.esm.min.js";
import * as params from "@params";

const gallery = document.getElementById("gallery");

if (gallery) {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: ".gallery-item",
    showHideAnimationType: "none",
    bgOpacity: 1,
    pswpModule: PhotoSwipe,

    imageClickAction: (releasePoint, e) => {
      extLink = pswp.currSlide.data.element.getAttribute("external-link");
      if(extLink) {
        window.open(extLink, "_blank");
      }
      return false;
    },

    closeTitle: params.closeTitle,
    arrowPrevTitle: params.arrowPrevTitle,
    arrowNextTitle: params.arrowNextTitle,
    errorMsg: params.errorMsg,

    zoom: false,
  });

  lightbox.on("uiRegister", () => {
    lightbox.pswp.ui.registerElement({
      name: "youtube-play-icon",
      order: 8,
      isButton: false,
      tagName: "a",
      appendTo: "root", 
      html: '<span class="fa-stack fa-3x" aria-hidden="true"><i class="fa-brands fa-youtube youtube-icon fa-stack-2x"></i><p class="fa-stack-1x">▶ </p></span>'
    });
  });

  lightbox.on("change", () => {
    const target = lightbox.pswp.currSlide?.data?.element?.dataset["pswpTarget"];
    history.replaceState("", document.title, "#" + target);

    playIcon = document.getElementsByClassName("pswp__youtube-play-icon")[0];
    extLink = pswp.currSlide.data.element.getAttribute("external-link");

    if(extLink) {
      playIcon.setAttribute("target", "_blank");
      playIcon.setAttribute("rel", "noopener");
      playIcon.href = extLink;
      playIcon.style.visibility="visible";
    } else {
      playIcon.style.visibility="hidden";
      playIcon.removeAttribute("target");
      playIcon.removeAttribute("rel");
      playIcon.removeAttribute("href");
    }
  });
  
  lightbox.on("close", () => {
    lightbox.on("change", () => {});

    playIcon = document.getElementsByClassName("pswp__youtube-play-icon")[0];
    extLink = pswp.currSlide.data.element.getAttribute("external-link");
    
    playIcon.style.visibility="hidden";
    playIcon.removeAttribute("target");
    playIcon.removeAttribute("rel");

    history.replaceState("", document.title, window.location.pathname);
  });

  new PhotoSwipeDynamicCaption(lightbox, {
    mobileLayoutBreakpoint: 700,
    type: "auto",
    mobileCaptionOverlapRatio: 1,
  });

  lightbox.init();

  if (window.location.hash.substring(1).length > 1) {
    const target = window.location.hash.substring(1);
    const items = gallery.querySelectorAll("a");
    for (let i = 0; i < items.length; i++) {
      if (items[i].dataset["pswpTarget"] === target) {
        lightbox.loadAndOpen(i, { gallery });
        break;
      }
    }
  }
}
