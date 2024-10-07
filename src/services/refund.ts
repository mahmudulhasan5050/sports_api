import { NotFoundError } from '../apiErrors/apiErrors';
import Refund, { IRefund } from '../models/Refund';

//get all
const allRefund = () => {
  return Refund.find();
};
//get by id
const getRefundById = async(refundId:string) =>{
  return await Refund.findById(refundId)
}

//create
const createRefund = async (newRefund: IRefund) => {
  const saveRefund = await newRefund.save();
  return saveRefund;
};

//update
const updateRefund = async (
    refundId: string,
  updatedRefundFromBody: IRefund
) => {
  const findAndUpdate = await Refund.findByIdAndUpdate(
    refundId,
    updatedRefundFromBody,
    { new: true }
  );
  if (!findAndUpdate)
    throw new NotFoundError('Can not update refund information!!');
  return findAndUpdate;
};

//delete
const deleteRefund = async (refundId: string) => {
  const deleteFromDatabase = await Refund.findByIdAndDelete(refundId);

  if (!deleteFromDatabase) throw new NotFoundError('Refund is not found');
  return deleteFromDatabase;
};

export default {
    allRefund,
    getRefundById,
    createRefund,
    updateRefund,
    deleteRefund,
};
