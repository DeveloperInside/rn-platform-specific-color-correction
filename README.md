
# Platform-Specific-Color-Correction

Have you ever noticed that colors on Android and iOS devices appear slightly different when you build your app using React Native? The culprit of this problem is the differing color spaces used by each platform; while Android uses the sRGB color space, iOS employs the DisplayP3 color space.

![DisplayP3 sRGB spaces](https://projects.ighda.com/pscc/media/p3-srgb-lab.gif)

This library resolves the issue of inconsistent colors between Android and iOS platforms by performing a color space conversion. This allows the colors to appear almost identical on both platforms, although it's important to note that some technical limitations exist.

iOS            |  Android
:-------------------------:|:-------------------------:
![ios color correction](https://projects.ighda.com/pscc/media/ios-color-correction-fix-ss.png)  |  ![android color correction](https://projects.ighda.com/pscc/media/android-color-correction-fix-ss.png)


Full documentation includes additional utils: https://projects.ighda.com/pscc/

## Installation

```bash
  npm install platform-specific-color-correction
```


## Usage/Examples

If you have a theme object that contains your colors, you can simply call osColorBalance(themeObject) once, and it will update all the colors in the object. Here's an example:

```javascript
const theme = {
    dark: {
        primary: '#FF5733',
        secondary: '#00C9A7',
        background: '#F6F6F6'
    }
};

function App() {
    useEffect(()=>{
        osColorBalance(theme); // This will update the colors   in the theme object
    },[])

  return <Navigation />
}
```

If you prefer not to modify your original theme object, you can use the clone property when calling osColorBalance(). Here's an example:

```javascript
const balancedColors = osColorBalance(theme, { clone: true });
```

In this case, osColorBalance() will create a new object called balancedColors that contains the adjusted colors. The original theme object will remain unchanged. This can be useful if you want to preserve the original color values for some reason.

The osColorBalance function supports various formats for colors that can be used as input. The accepted formats include:

* A single color string in the format of:
    * rgb(red, green, blue) where red, green, and blue are integers between 0 and 255.
    * hsl(hue, saturation, lightness) where hue is an angle between 0 and 360, and saturation and lightness are percentages between 0% and 100%.
    * A six-digit hex value in the format #RRGGBB where RR, GG, and BB are hexadecimal values between 00 and FF.

* An object with nested values, where the final value must be a color string. For example:
```javascript

{
  primary: 'rgb(255, 0, 0)',
  secondary: {
    light: '#00FF00',
    dark: 'hsl(240, 100%, 50%)'
  }
}
```

### Parameters

* colors - The colors to apply the color balance to. The colors can be specified as:
    * A single color string in the format of 'rgb(255, 255, 255)', 'hsl(359, 100%, 50%)', or a six-digit hex value.
    * An object with nested values, where the final value must be a color string.
    * An array of color strings or objects with nested values, where the final value of each object must be a color string.
* options - An optional object containing options for the color balance. It can have the following properties:
    * platforms - An optional array of platform names to apply the color balance to. The default value is ['ios'].
    * balanceFunc - An optional color balance function to use. The default value is shiftDisplayP3toSrgb.
    * clone - An optional boolean indicating whether to clone the input colors before applying the color balance. The default value is false.
    
#### Return value

osColorBalance returns the adjusted colors. If the clone option is set to true, it will return a new object with the adjusted colors. Otherwise, it will modify the original object passed as the first parameter.

```javascript
// Example 1: Applying color balance to a single color string
const color = osColorBalance('rgb(113, 36, 161)');

// Example 2: Applying color balance to an object with nested values
const colorsObj = {
  primary: 'rgb(0, 128, 0)',
  secondary: {
    light: 'hsl(359, 26%, 67%)',
    dark: 'hsl(206, 100%, 10%)'
  }
};

// Modify the original object
osColorBalance(colorsObj);

// Example 3: Applying color balance to an array of color strings and objects with nested values
const colorsArr = [
  'rgb(43, 114, 164)',
  {
    light: 'hsl(275, 48%, 36%)',
    dark: 'hsl(136, 35%, 54%)'
  },
  '#1d781d'
];

// Clone the original object and apply color balance to android and web platforms
const updatedColorsArr = osColorBalance(colorsArr, {
  platforms: ['android', 'web'],
  balanceFunc: shiftSrgbToDisplayP3,
  clone: true
});
```

## Further Info
Most standard panels and Android phones use sRGB color space. But ios prefers using DisplayP3 color space which has a wider gamut that means can display more colors on the screen. 
If we compare two color spaces, you can see the difference clearly. 

![DisplayP3 vs sRGB](https://projects.ighda.com/pscc/media/p3-vs-srgb.png)

We mostly pick our colors from sRGB color space, and if we want to use the same colors on IOS, we need to convert these colors. 
You can make this conversion using this library or manually for IOS distribution by using the colorsync utility app with a Mac.

![colorsync sample](https://projects.ighda.com/pscc/media/colorsync-sample.png)

As you can see, there is a slight difference between the red, green, and blue color values of this mustard color in two color spaces. If we want to catch up with consistency between platforms, we need conversion.

### How to convert one color space to another?
#### What is color space?
First, we need to understand what colorspace is.

A color space is a mathematical model that defines a range of colors that can be represented and displayed on a particular device or medium. It is essentially a way of mapping colors to a set of coordinates, which allows them to be represented and manipulated digitally.

Color spaces are typically defined by a set of **primary colors**, **a white point**, and **a gamma curve**. 

**The primary colors** are the colors that can be mixed together to create all other colors within the color space. For example, the primary colors of the RGB color space are red, green, and blue.

**The white point** represents the brightest or whitest color that can be displayed within the color space. It is used as a reference point for other colors within the space.

**The gamma curve** describes how the intensity of the colors in the color space are distributed. It essentially maps the input values to the output values, which determines how bright or dark the colors appear on a display.

There are many different color spaces that are used for different purposes, such as RGB (used for displays and digital images), CMYK (used for printing), and LAB (used for scientific color analysis). Each color space has its own set of primary colors, a white point, and a gamma curve, which makes them suitable for different applications.

Color spaces are important because they allow us to accurately represent and manipulate colors digitally. When working with digital images, it's important to use the appropriate color space to ensure that the colors are displayed correctly on different devices and media. Color spaces also allow us to convert colors between different spaces, which is useful when working with images or graphics that need to be displayed on different devices or media.

#### How to convert  DisplayP3 color space to sRGB?

If we wish to change a color from one color space to another, we must calculate the transformation matrix. This matrix helps us establish the correlation between a point in one color space and its corresponding point in another color space.

If you are curious about how these matrices calculate, you can check this website. 
http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html

We can use XYZ color-space as an intermediate color-space to calculate the direct transformation matrix from DisplayP3 to sRGB.

```javascript
const DISPLAYP3_50_XYZ_ADAPTED = [
[0.5151187, 0.2919778, 0.1571035],
[0.2411892, 0.6922441, 0.0665668],
[-0.0010505, 0.0418791, 0.7840713],
]

const XYZ_SRGB_50_ADAPTED = [
[3.1341864, -1.617209, -0.4906941],
[-0.9787485, 1.9161301, 0.0334334],
[0.0719639, -0.2289939, 1.4057537],
]
```

If we multiply these matrices, we obtain a direct transformation matrix of DisplayP3 to sRGB.

```javascript
export const DISPLAYP3_SRGB_50_ADAPTED = [
[1.2249, -0.22494, 6.4142e-8],
[-0.042057, 1.0421, 3.5723e-9],
[-0.019638, -0.078636, 1.0983],
]
```

#### Transfer function (Gamma)
Gamma encoding of images is used to optimize the usage of bits when encoding an image, or bandwidth used to transport an image, by taking advantage of the non-linear manner in which humans perceive light and color.

Both before and after utilizing this transformation matrix, it is necessary to account for gamma (transfer function).  
sRGB and DisplayP3 use the same transfer function. You can find how to calculate the transfer function and more info at https://en.wikipedia.org/wiki/SRGB

sRGB to CIE XYZ transfer function  
![transfer function gamma](https://projects.ighda.com/pscc/media/gamma-srgb-to-xyz.svg)

CIE XYZ to sRGB transfer function  
![reverse transfer function gamma](https://projects.ighda.com/pscc/media/gamma-xyz-to-srgb.svg)

## Credits

 - [Exploring the display-P3 color space](http://endavid.com/index.php?entry=79)
 - [Bruce Lindbloom](http://www.brucelindbloom.com/)
 - [Russell Cottrell matrix calculator](http://www.russellcottrell.com/photo/matrixCalculator.htm)
 - [Wiki sRGB](https://en.wikipedia.org/wiki/SRGB)
 - [Wiki Gamma](https://en.wikipedia.org/wiki/Gamma_correction)

## Contributing

Thank you for considering contributing to this library! Here are some guidelines to help you get started.

### How to contribute

1. Fork this repository to your own GitHub account and clone it to your local machine.
2. Create a new branch for your changes: `git checkout -b my-new-feature`.
3. Make your changes and test them thoroughly.
4. Commit your changes: `git commit -m 'Add some feature'`.
5. Push to the branch: `git push origin my-new-feature`.
6. Create a new Pull Request and provide a clear and descriptive title.

### Coding conventions

Please follow these coding conventions when contributing to the library:

- Use 2 spaces for indentation.
- Use single quotes for strings.
- Use camelCase for variables and functions.
- Use PascalCase for classes and constructors.
- Use JSDoc-style comments to document your code.

### Testing

Please make sure your changes are thoroughly tested before submitting a Pull Request. 

### Issues and feature requests

If you find a bug or have a feature request, please open an issue on GitHub. Please provide as much detail as possible, including the steps to reproduce the issue or a description of the feature you would like to see.

### License

By contributing to the library, you agree that your contributions will be licensed under the MIT License.


## Support

For support, email touch@ighda.com.

## License

[MIT](/LICENSE)

