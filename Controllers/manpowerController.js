import { Manpower } from '../Models/manpowerModel.js';

export const createManpower = async (req, res) => {
  try {
    const { blockPlanningUnitName, district } = req.body;

    if (!blockPlanningUnitName || !district) {
      return res.status(400).json({
        success: false,
        error: 'Block / planning unit name and district are required',
      });
    }

    const existingDefault = await Manpower.findOne({ recordKey: 'default' });
    const existingManpower =
      existingDefault || (await Manpower.findOne().sort({ updatedAt: -1, createdAt: -1 }));

    const manpower = existingManpower
      ? await Manpower.findByIdAndUpdate(
          existingManpower._id,
          { ...req.body, recordKey: 'default' },
          { new: true, runValidators: true },
        )
      : await Manpower.create({ ...req.body, recordKey: 'default' });

    await Manpower.deleteMany({ _id: { $ne: manpower._id } });

    return res.status(201).json({
      success: true,
      message: 'Manpower details saved successfully',
      data: manpower,
    });
  } catch (error) {
    console.error('Create manpower error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

export const getManpower = async (_req, res) => {
  try {
    const defaultManpower = await Manpower.findOne({ recordKey: 'default' });
    const latestManpower =
      defaultManpower || (await Manpower.findOne().sort({ updatedAt: -1, createdAt: -1 }));

    if (latestManpower) {
      if (!defaultManpower) {
        await Manpower.deleteMany({ _id: { $ne: latestManpower._id } });
        latestManpower.recordKey = 'default';
        await latestManpower.save();
      } else {
        await Manpower.deleteMany({ _id: { $ne: latestManpower._id } });
      }
    }

    return res.status(200).json({
      success: true,
      data: latestManpower ? [latestManpower] : [],
    });
  } catch (error) {
    console.error('Get manpower error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};
