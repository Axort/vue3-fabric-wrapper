<script>
import fabricObject from "./fabricObject";
export default {
  name: "fabric-image-from-URL",
  mixins: [fabricObject],
  props: {
    url: { type: String, default: "../vue.png" },
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      image: null,
      type: "image",
      customWatch: ["url"],
    };
  },
  render(h) {
    return this.$slots.default ? h("div", this.$slots.default) : undefined;
  },
  watch: {
    parentItem: {
      handler(newValue) {
        if (newValue) {
          //Parent is created
          this.createImage();
        }
      },
      immediate: true,
    },
    url(newValue) {
      if (this.parentItem) {
        if (this.image) {
          this.destroyImage();
        }
        this.createImage();
      }
    },
  },
  methods: {
    createImage() {
      // this.fabric.util.loadImage(
      //   this.url,
      //   (img) => {
      //     this.image = new this.fabric.Image(img);
      //     this.$emit("image-loaded", this.image);
      //     if (this.parentType == "group") {
      //       if (this.parentItem.addWithoutUpdate) {
      //         this.parentItem.add(this.image);
      //       } else {
      //         this.parentItem.addWithUpdate(this.image);
      //       }
      //     } else {
      //       this.canvas.add(this.image);
      //     }
      //     this.createEvents();
      //     this.createWatchers();
      //   },
      //   null,
      //   { ...this.definedProps }
      // );
      this.fabric.Image.fromURL(
        this.url,
        (img) => {
          this.image = img;
          this.$emit("image-loaded", img);
          if (this.parentType == "group") {
            if (this.parentItem.addWithoutUpdate) {
              this.parentItem.add(this.image);
            } else {
              this.parentItem.addWithUpdate(this.image);
            }
          } else {
            this.canvas.add(this.image);
          }
          this.createEvents();
          this.createWatchers();
        },
        { ...this.definedProps, crossOrigin: "anonymous" }
      );
      // let img = new Image();
      // this.toDataUrl(this.url, (dataUri) => {
      //   img.src = dataUri;
      //   let inst = this;
      //   img.onload = function () {
      //     inst.image = new inst.fabric.Image(img);
      //     inst.$emit("image-loaded", inst.image);
      //     if (inst.parentType == "group") {
      //       if (inst.parentItem.addWithoutUpdate) {
      //         inst.parentItem.add(inst.image);
      //       } else {
      //         inst.parentItem.addWithUpdate(inst.image);
      //       }
      //     } else {
      //       inst.canvas.add(inst.image);
      //     }
      //     inst.createEvents();
      //     inst.createWatchers();
      //   };
      //   img.crossOrigin = "anonymous";
      // });
    },
    destroyImage() {
      this.destroyEvents();
      if (this.parentType == "group") {
        if (this.group) {
          this.group.removeWithUpdate(this.image);
        }
      } else {
        if (this.canvas) {
          this.canvas.remove(this.image);
        }
        this.image = null;
      }
    },
    toDataUrl(url, callback) {
      let xhr = new XMLHttpRequest();
      xhr.onload = function () {
        let reader = new FileReader();
        reader.onloadend = () => {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };

      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    },
  },
};
</script>
