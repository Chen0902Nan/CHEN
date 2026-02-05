import { IsString, IsNotEmpty } from 'class-validator';

export class SearchDto {
  @IsString({ message: 'keyword 要为字符串' })
  @IsNotEmpty({ message: 'keyword 不能为空' })
  keyword: string;
}
