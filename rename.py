import os
import shutil

# 设置目标目录
img_directory = "public/images/posts"  # 图片文件所在目录
posts_directory = "content/posts/article"  # Markdown 文件所在目录

# 遍历图片目录中的所有文件
for filename in os.listdir(img_directory):
    if filename.endswith((".jpg", ".png", ".gif", ".mp4")):

        # 提取 postName 和扩展名
        last_dash_index = filename.rfind("-")
        post_name = filename[:last_dash_index]  # postName 为最后一个 "-" 前的部分
        extension = filename.split(".")[-1]

        # 在 posts_directory 中查找匹配的 Markdown 文件
        md_filename_pattern = f"{post_name}.md"
        matching_md_file = None

        for root, dirs, files in os.walk(posts_directory):
            # 在每个目录中查找符合 pattern 的 .md 文件
            for file in files:
                if file.endswith(md_filename_pattern):
                    matching_md_file = os.path.join(root, file)
                    break
            if matching_md_file:
                break

        if matching_md_file:
            # 如果找到匹配的 .md 文件，提取日期部分
            md_filename = os.path.basename(matching_md_file)
            date = md_filename.split(".")[0]
            year = os.path.basename(os.path.dirname(matching_md_file))
            folder_name = os.path.join("article", year, f"{date}.{post_name}")
        else:
            # 如果没有找到对应的 Markdown 文件，使用 postName 作为文件夹名
            folder_name = post_name

        # 构建目标文件夹路径
        post_folder = os.path.join(img_directory, folder_name)

        # 如果文件夹不存在，创建文件夹
        if not os.path.exists(post_folder):
            os.makedirs(post_folder)

        # 生成新的文件名
        new_filename = filename.replace(f"{post_name}-", "")  # 移除 postName- 前缀
        new_file_path = os.path.join(post_folder, new_filename)

        # 移动并重命名文件
        source_file_path = os.path.join(img_directory, filename)
        shutil.move(source_file_path, new_file_path)
        print(f"Moved: {filename} -> {new_file_path}")

print("Files have been successfully organized.")
