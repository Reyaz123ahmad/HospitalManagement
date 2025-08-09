const Category = require('../models/Category');

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const categoryDetails = await Category.create({
      name,
      description: description || ""
    });

    return res.status(200).json({
      success: true,
      message: 'Category created successfully',
      data: categoryDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Show all categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });
    
    return res.status(200).json({
      success: true,
      message: 'All categories fetched successfully',
      data: allCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    
    const selectedCategory = await Category.findById(categoryId)
      .populate('doctors')
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const differentCategories = await Category.find({
      _id: { $ne: categoryId }
    }).populate('doctors').exec();

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories
      }
    });
    }catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
