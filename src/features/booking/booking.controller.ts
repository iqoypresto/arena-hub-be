import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../validations/validate";
import { BookingValidation } from "./booking.validation";


export class BookingController {
  static async create(req: Request, res: Response) {
    const {body} = validate(BookingValidation.CREATE, {body: req?.body})
    const {payload} = res.locals
    
  
    const court = await BookingService.create(payload?.sub, {body})

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Booked successfully",
      data: court
    })
  }

  static async getAll(req: Request, res: Response){
    const {query} = validate(BookingValidation.GET_ORGANIZER_BOOKINGS, {query: req?.query})

    const bookings = await BookingService.getAll({query})

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bookings fetched successfully',
      ...bookings
    })
  }

  static async getMyBookings(req: Request, res: Response){
    const {query} = validate(BookingValidation.GET_MY_BOOKINGS, {query: req?.query})

    const {payload} = res.locals

    const bookings = await BookingService.getMyBookings(payload.sub, {query})

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Bookings fetched successfully",
      ...bookings
    })
  }

  static async getDetail(req: Request, res: Response){
    const {params} = validate(BookingValidation.GET_DETAIL, {params: req?.params})

    const {payload} = res.locals

    const booking = await BookingService.getDetail(payload, {params})

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking
    })
  }

  static async cancel(req: Request, res: Response){
    const {params} = validate(BookingValidation.CANCEL, {params: req?.params})

    const { payload } = res.locals

    const booking = await BookingService.cancel(payload.sub, {params})

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    })
  }

  static async uploadPayment(req: Request, res: Response){
    const {params} = validate(BookingValidation.UPLOAD_PAYMENT, {params: req?.params})

    const {payload} = res.locals

    const booking = await BookingService.uploadPayment(payload.sub, {params}, req.file)

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: booking
    })
  }

  static async approve(req: Request, res: Response){
    const {params} = validate(BookingValidation.APPROVE, {params: req?.params})

    const booking = await BookingService.approve({params})

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Booking approved successfully',
      data: booking
    })
  }

  static async reject(req: Request, res: Response){
    const {params, body} = validate(BookingValidation.REJECT, {params: req?.params, body: req?.body})

    const booking = await BookingService.reject({params, body})

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Booking rejected successfully",
      data: booking
  })
  }
}
