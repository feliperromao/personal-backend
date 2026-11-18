import {
  IsHexColor,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateBrandingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  appName: string;

  @IsHexColor()
  primaryColor: string;

  @IsHexColor()
  footerColor: string;

  @IsString()
  @MaxLength(2048)
  @ValidateIf((_, value) => value !== '')
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  logoUrl: string;
}
