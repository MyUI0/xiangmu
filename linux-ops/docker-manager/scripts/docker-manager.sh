#!/bin/bash

# Docker 容器管理脚本
# 用于管理 Docker 容器和镜像的命令行工具

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 打印彩色输出
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
}

# 检查 Docker 是否运行
check_docker_running() {
    if ! docker info &> /dev/null; then
        print_error "Docker 守护进程未运行，请先启动 Docker"
        exit 1
    fi
}

# 显示容器列表
list_containers() {
    print_info "容器列表："
    echo ""
    docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    echo ""
}

# 显示镜像列表
list_images() {
    print_info "镜像列表："
    echo ""
    docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    echo ""
}

# 启动容器
start_container() {
    local container=$1
    if [ -z "$container" ]; then
        print_error "请指定容器名称或ID"
        return 1
    fi
    print_info "启动容器: $container"
    if docker start "$container"; then
        print_success "容器 $container 启动成功"
    else
        print_error "容器 $container 启动失败"
    fi
}

# 停止容器
stop_container() {
    local container=$1
    if [ -z "$container" ]; then
        print_error "请指定容器名称或ID"
        return 1
    fi
    print_info "停止容器: $container"
    if docker stop "$container"; then
        print_success "容器 $container 停止成功"
    else
        print_error "容器 $container 停止失败"
    fi
}

# 重启容器
restart_container() {
    local container=$1
    if [ -z "$container" ]; then
        print_error "请指定容器名称或ID"
        return 1
    fi
    print_info "重启容器: $container"
    if docker restart "$container"; then
        print_success "容器 $container 重启成功"
    else
        print_error "容器 $container 重启失败"
    fi
}

# 删除容器
delete_container() {
    local container=$1
    local force=$2
    if [ -z "$container" ]; then
        print_error "请指定容器名称或ID"
        return 1
    fi
    
    local args=""
    if [ "$force" = "force" ]; then
        args="-f"
        print_warning "强制删除容器: $container"
    else
        print_info "删除容器: $container"
    fi
    
    if docker rm $args "$container"; then
        print_success "容器 $container 删除成功"
    else
        print_error "容器 $container 删除失败"
    fi
}

# 查看容器日志
view_logs() {
    local container=$1
    if [ -z "$container" ]; then
        print_error "请指定容器名称或ID"
        return 1
    fi
    print_info "容器 $container 的日志："
    echo ""
    docker logs --tail 100 "$container"
    echo ""
}

# 进入容器
exec_container() {
    local container=$1
    local shell=${2:-/bin/sh}
    if [ -z "$container" ]; then
        print_error "请指定容器名称或ID"
        return 1
    fi
    print_info "进入容器: $container"
    docker exec -it "$container" "$shell"
}

# 显示系统信息
show_system_info() {
    print_info "Docker 系统信息："
    echo ""
    docker info
    echo ""
}

# 清理未使用的资源
cleanup() {
    print_warning "开始清理未使用的 Docker 资源..."
    echo ""
    docker system prune -af
    echo ""
    print_success "清理完成"
}

# 启动 Web 管理界面
start_web_ui() {
    print_info "启动 Web 管理界面..."
    cd "$PROJECT_ROOT/backend"
    
    if [ ! -d "node_modules" ]; then
        print_info "首次运行，安装依赖..."
        npm install
    fi
    
    print_success "Web 界面将在 http://localhost:3000 启动"
    npm start
}

# 显示帮助
show_help() {
    echo "Docker 容器管理工具"
    echo ""
    echo "用法: $0 [命令] [参数]"
    echo ""
    echo "命令列表："
    echo "  ps, containers       显示所有容器列表"
    echo "  images          显示所有镜像列表"
    echo "  start <容器>    启动指定容器"
    echo "  stop <容器>     停止指定容器"
    echo "  restart <容器>  重启指定容器"
    echo "  rm <容器> [force]  删除指定容器，force 表示强制删除"
    echo "  logs <容器>     查看容器日志"
    echo "  exec <容器> [shell]  进入容器，默认使用 /bin/sh"
    echo "  info            显示 Docker 系统信息"
    echo "  cleanup         清理未使用的 Docker 资源"
    echo "  web             启动 Web 管理界面"
    echo "  help, -h, --help  显示此帮助信息"
    echo ""
}

# 主函数
main() {
    check_docker
    check_docker_running
    
    local command=$1
    shift
    
    case $command in
        ps|containers)
            list_containers
            ;;
        images)
            list_images
            ;;
        start)
            start_container "$1"
            ;;
        stop)
            stop_container "$1"
            ;;
        restart)
            restart_container "$1"
            ;;
        rm)
            delete_container "$1" "$2"
            ;;
        logs)
            view_logs "$1"
            ;;
        exec)
            exec_container "$1" "$2"
            ;;
        info)
            show_system_info
            ;;
        cleanup)
            cleanup
            ;;
        web)
            start_web_ui
            ;;
        help|-h|--help)
            show_help
            ;;
        *)
            if [ -z "$command" ]; then
                show_help
            else
                print_error "未知命令: $command"
                echo ""
                show_help
                exit 1
            fi
            ;;
    esac
}

# 执行主函数
main "$@"
