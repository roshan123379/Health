import { Microplan } from '../Models/microplanModel.js';

export const createMicroplan = async (req, res) => {
  try {
    const { blockPlanningUnitName, district } = req.body;

    if (!blockPlanningUnitName || !district) {
      return res.status(400).json({
        success: false,
        error: 'Block / planning unit name and district are required',
      });
    }

    const existingDefault = await Microplan.findOne({ recordKey: 'default' });
    const existingMicroplan =
      existingDefault || (await Microplan.findOne().sort({ updatedAt: -1, createdAt: -1 }));

    const microplan = existingMicroplan
      ? await Microplan.findByIdAndUpdate(
          existingMicroplan._id,
          { ...req.body, recordKey: 'default' },
          { new: true, runValidators: true },
      )
      : await Microplan.create({ ...req.body, recordKey: 'default' });

    await Microplan.deleteMany({ _id: { $ne: microplan._id } });

    return res.status(201).json({
      success: true,
      message: 'Microplan saved successfully',
      data: microplan,
    });
  } catch (error) {
    console.error('Create microplan error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

export const getMicroplans = async (_req, res) => {
  try {
    const microplans = await Microplan.find().sort({ updatedAt: -1, createdAt: -1 });
    const latestMicroplan = microplans[0] || null;

    if (latestMicroplan) {
      if (latestMicroplan.recordKey !== 'default') {
        latestMicroplan.recordKey = 'default';
        await latestMicroplan.save();
      }

      await Microplan.deleteMany({ _id: { $ne: latestMicroplan._id } });
    }

    return res.status(200).json({
      success: true,
      data: latestMicroplan ? [latestMicroplan] : [],
    });
  } catch (error) {
    console.error('Get microplans error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};
