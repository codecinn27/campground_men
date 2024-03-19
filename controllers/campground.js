const Campground = require('../model/campground');
const {cloudinary} = require('../cloudinary/index');

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderIndexNew = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground', 400); //400 means client error message
    // console.log(req.files);
    const campgrounds = new Campground(req.body.campground);
    campgrounds.image = req.files.map(f=> ({url: f.path, filename: f.filename}))
    campgrounds.author = req.user._id;
    await campgrounds.save();
    console.log(campgrounds);
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.renderIdCampground = async(req,res)=>{
    const campgrounds = await Campground.findById(req.params.id).populate({path:'reviews',populate:{path: 'author'}}).populate('author');
    // console.log(campgrounds);
    if(!campgrounds){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campgrounds});
    
}

module.exports.renderEditCampgrounds =async(req,res)=>{
    const {id} = req.params;
    const campgrounds = await Campground.findById(id);
    if(!campgrounds){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    console.log(campgrounds);
    res.render(`campgrounds/edit`, {campgrounds});
    
}

module.exports.editCampgrounds = async(req,res)=>{
    const {id} = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f=> ({url: f.path, filename: f.filename}));
    campground.image.push(...imgs)
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {image:{filename: {$in: req.body.deleteImages}}}});
        console.log(campground);
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampgrounds = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds');
}