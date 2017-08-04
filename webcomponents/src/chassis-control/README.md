# chassis-control

Form Control component for Chassis Framework.

The tag supports two optional attributes: `os` and `title`.

**os** can be `windows` or `mac`. If this is not specified, the user's operating system is automatically detected and used.

**title** is the window title.

## Usage

```html
<html>
  <head>
  <!-- <link rel="import" href="../../author-window.html"/> -->
  <!-- <script src="../../dist/author-window.min.js"></script> -->
  <!-- <script src="../../tags/author-window/tag.js"></script> -->
  <script src="//cdn.jsdelivr.net/webcomponentsjs/latest/webcomponents.min.js"></script>
  <script src="//cdn.jsdelivr.net/chassis-components/latest/author-window.min.js"></script>
  </head>
  <body>
    <chassis-control type="text" label="">
      
    </chassis-control>
  </body>
</html>
```
