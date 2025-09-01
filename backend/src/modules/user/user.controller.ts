import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Request() req) {
        return this.userService.findById(req.user.sub);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('plan')
    async getPlan(@Request() req) {
        const userPlan = await this.userService.getPlan(req.user.sub);
        console.log(userPlan)
        return userPlan
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('discount/history')
    async getDiscountHistory(@Request() req) {
        return this.userService.getDiscountHistory(req.user.sub, true);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('history')
    async getHistory(@Request() req) {
        return this.userService.getHistory(req.user.sub);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('barbers/next-services')
    async getNextServices(@Request() req) {
        const times = await this.userService.getWorkTimes(req.user.sub);
        const nextServices = await this.userService.getNextServices(req.user.sub);
        const days = await this.userService.getWorkingDays(req.user.sub);

        return { days, nextServices, times };
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get('barbers')
    async getBarbers() {
        return this.userService.getBarbers();
    }

    @Get('barbers/:barberId/available-today')
    async getAvailableYoday(@Param('barberId') barberId: string) {
        const today = new Date();
        const serviceDuration = 30;

        const availableSlotsToday = await this.userService.getAvailableSlots(barberId, today, serviceDuration);

        return availableSlotsToday.length > 0
    }

    @Get('barbers/:barberId/available-slots')
    async getAvailableSlots(@Param('barberId') barberId: string, @Query('date') date: string, @Query('serviceDuration') serviceDuration: string) {
        return this.userService.getAvailableSlots(barberId, new Date(date), Number(serviceDuration));
    }

    @Get('barbers/:barberId/available-days')
    async getAvailableDays(@Param('barberId') barberId: string) {
        return this.userService.getBarberDays(barberId);
    }

    @Get('barbers/:barberId/services')
    async getBarberServices(@Param('barberId') barberId: string) {
        return this.userService.getBarberServices(barberId);
    }

    @Get('checkout/discount')
    async getDiscount(@Query('userId') userId: string, @Query('serviceId') serviceId: string) {
        return this.userService.getUserDiscount(userId, serviceId);
    }

    // @Get('fix')
    // fix() {
    //     return this.userService.fix();
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put('/barbers/:id/services')
    addService(@Param('id') id: string, @Body('services') services: string[]) {
        return this.userService.addServices(id, services)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    
}
