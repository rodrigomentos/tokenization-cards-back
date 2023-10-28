import { ApiProperty } from "@nestjs/swagger";

export class LoginAuthResponseDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    userName: string;
    
    @ApiProperty()
    accessToken: string;
    
    @ApiProperty()
    refreshToken: string;    
    
    @ApiProperty()
    token: string;

    @ApiProperty()
    tokenCommercial: string;
}